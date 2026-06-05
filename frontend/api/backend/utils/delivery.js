const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendKeyEmail } = require('./email');
const { sendKeyWhatsApp } = require('./whatsapp');
const { generateInvoice } = require('./invoice');
const path = require('path');
const fs = require('fs');

let deliveryQueue = [];
let processingDelivery = false;

function enqueueDelivery(order) {
  return new Promise((resolve, reject) => {
    deliveryQueue.push({ order, resolve, reject });
    if (!processingDelivery) processNextDelivery();
  });
}

async function processNextDelivery() {
  if (deliveryQueue.length === 0) {
    processingDelivery = false;
    return;
  }
  processingDelivery = true;
  const { order, resolve, reject } = deliveryQueue.shift();
  try {
    const result = await processOrderDeliveryInternal(order);
    resolve(result);
  } catch (err) {
    reject(err);
  } finally {
    processNextDelivery();
  }
}

const assignKeysAtomic = async (order) => {
  const items = [];
  const assignedKeyDocs = [];
  try {
    for (const item of order.items) {
      const assigned = [];
      for (let i = 0; i < item.quantity; i++) {
        const key = await Inventory.findOneAndUpdate(
          { product: item.product, isUsed: false },
          { isUsed: true, order: order._id, usedAt: new Date().toISOString() },
          { new: true }
        );
        if (!key) {
          throw new Error(`Insufficient keys for ${item.productName}`);
        }
        assigned.push(key.key);
        assignedKeyDocs.push(key);
      }
      items.push({ ...item, keys: assigned });
    }
    return items;
  } catch (error) {
    // Rollback: unmark all assigned keys
    for (const key of assignedKeyDocs) {
      await Inventory.findByIdAndUpdate(key._id, { isUsed: false, order: null, usedAt: null });
    }
    throw error;
  }
};

const resendDelivery = async (order) => {
  try {
    const user = order.user || await User.findById(order.user);
    if (!user) {
      console.error(`User not found for order ${order.orderId}`);
      throw new Error('User not found');
    }

    const items = order.items || [];
    const allKeys = items.flatMap(i => i.keys || []);
    const customerEmail = order.customerInfo?.email || user.email;
    const customerPhone = order.customerInfo?.phone || user.phone;
    const customerName = order.customerInfo?.name || user.name;

    if (process.env.SMTP_HOST) {
      try {
        await sendKeyEmail({
          to: customerEmail,
          subject: 'Your Software Keys from PC Deals India',
          productName: items.map(i => i.productName).join(', '),
          keys: allKeys,
          orderId: order.orderId,
          customerName,
        });
      } catch (e) {
        console.error('Email resend error:', e.message);
      }
    } else {
      console.log(`[Resend] Email not configured — would send to ${customerEmail}`);
    }

    if (process.env.WHATSAPP_API_KEY && process.env.WHATSAPP_API_KEY !== 'your_gupshup_api_key') {
      try {
        await sendKeyWhatsApp({
          phone: customerPhone,
          customerName,
          productName: items[0]?.productName || 'Product',
          key: allKeys[0] || '',
          orderId: order.orderId,
        });
      } catch (e) {
        console.error('WhatsApp resend error:', e.message);
      }
    } else {
      console.log(`[Resend] WhatsApp not configured — would send to ${customerPhone}`);
    }

    return order;
  } catch (error) {
    console.error('Resend delivery error:', error.message);
    throw error;
  }
};

const processOrderDeliveryInternal = async (order) => {
  try {
    const user = await User.findById(order.user);
    if (!user) {
      console.error(`User not found for order ${order.orderId}, user ID: ${order.user}`);
      order.orderStatus = 'processing';
      order.paymentStatus = 'paid';
      await Order.findByIdAndUpdate(order._id, { orderStatus: 'processing', paymentStatus: 'paid' });
      throw new Error(`User not found for delivery`);
    }
    const items = await assignKeysAtomic(order);

    order.items = items;
    order.orderStatus = 'completed';
    order.paymentStatus = 'paid';

    const allKeys = items.flatMap(i => i.keys);

    if (process.env.SMTP_HOST) {
      try {
        await sendKeyEmail({
          to: order.customerInfo?.email || user.email,
          subject: 'Your Software Keys from PC Deals India',
          productName: items.map(i => i.productName).join(', '),
          keys: allKeys,
          orderId: order.orderId,
          customerName: order.customerInfo?.name || user.name,
        });
      } catch (e) {
        console.error('Email send error:', e.message);
      }
    } else {
      console.log(`[Delivery] Email not configured — would send to ${order.customerInfo?.email || user.email}`);
    }

    if (process.env.WHATSAPP_API_KEY && process.env.WHATSAPP_API_KEY !== 'your_gupshup_api_key') {
      try {
        await sendKeyWhatsApp({
          phone: order.customerInfo?.phone || user.phone,
          customerName: order.customerInfo?.name || user.name,
          productName: items[0]?.productName || 'Product',
          key: allKeys[0] || '',
          orderId: order.orderId,
        });
      } catch (e) {
        console.error('WhatsApp send error:', e.message);
      }
    } else {
      console.log(`[Delivery] WhatsApp not configured — would send to ${order.customerInfo?.phone || user.phone}`);
    }

    try {
      const invoicePdf = await generateInvoice(order, user);
      const invoiceDir = process.env.RENDER || process.env.VERCEL
        ? '/tmp/invoices'
        : path.join(__dirname, '..', 'invoices');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }
      const invoicePath = path.join(invoiceDir, `invoice_${order.orderId}.pdf`);
      fs.writeFileSync(invoicePath, invoicePdf);
      order.invoiceUrl = `/invoices/invoice_${order.orderId}.pdf`;
    } catch (e) {
      console.error('Invoice generation error:', e.message);
    }

    const isFirstOrder = (await Order.countDocuments({ user: order.user, paymentStatus: 'paid', createdAt: { $lte: order.createdAt || new Date() } })) <= 1;
    let cashbackEarned = 0;
    if (isFirstOrder) {
      cashbackEarned = Math.min(order.amount * 0.25, 500);
    } else if (order.paymentMethod === 'razorpay') {
      cashbackEarned = order.amount * 0.02;
    }
    order.cashbackEarned = Math.round(cashbackEarned);

    if (cashbackEarned > 0) {
      await User.findByIdAndUpdate(order.user, {
        $inc: { walletBalance: cashbackEarned, totalCashbackEarned: cashbackEarned },
      });
    }

    await Order.findByIdAndUpdate(order._id, order);
    return order;
  } catch (error) {
    console.error('Delivery processing error:', error.message);
    await Order.findByIdAndUpdate(order._id, { orderStatus: 'processing', paymentStatus: 'paid', cashbackEarned: 0, invoiceUrl: undefined });
    throw error;
  }
};

const processOrderDelivery = (order) => enqueueDelivery(order);

module.exports = { processOrderDelivery, resendDelivery };
