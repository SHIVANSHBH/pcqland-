const Inventory = require('../models/Inventory');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendKeyEmail } = require('./email');
const { sendKeyWhatsApp } = require('./whatsapp');
const { generateInvoice } = require('./invoice');
const path = require('path');
const fs = require('fs');

const assignKeys = async (order) => {
  const items = [];
  for (const item of order.items) {
    const keys = await Inventory.find({ product: item.product, isUsed: false }).limit(item.quantity).exec();
    if (!Array.isArray(keys)) {
      throw new Error(`Insufficient keys for ${item.productName}`);
    }
    if (keys.length < item.quantity) {
      throw new Error(`Insufficient keys for ${item.productName}`);
    }
    const keyStrings = keys.map(k => k.key);
    await Inventory.updateMany(
      { _id: { $in: keys.map(k => k._id) } },
      { isUsed: true, order: order._id, usedAt: new Date().toISOString() }
    );
    items.push({ ...item, keys: keyStrings });
  }
  return items;
};

const processOrderDelivery = async (order) => {
  try {
    const user = await User.findById(order.user);
    if (!user) {
      console.error(`User not found for order ${order.orderId}, user ID: ${order.user}`);
      order.orderStatus = 'processing';
      order.paymentStatus = 'paid';
      await Order._store.update({ _id: order._id }, order);
      throw new Error(`User not found for delivery`);
    }
    const items = await assignKeys(order);

    order.items = items;
    order.orderStatus = 'completed';
    order.paymentStatus = 'paid';

    const allKeys = items.flatMap(i => i.keys);

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

    try {
      const invoicePdf = await generateInvoice(order, user);
      const invoiceDir = path.join(__dirname, '..', 'invoices');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }
      const invoicePath = path.join(invoiceDir, `invoice_${order.orderId}.pdf`);
      fs.writeFileSync(invoicePath, invoicePdf);
      order.invoiceUrl = `/invoices/invoice_${order.orderId}.pdf`;
    } catch (e) {
      console.error('Invoice generation error:', e.message);
    }

    const isFirstOrder = (await Order.countDocuments({ user: order.user, paymentStatus: 'paid' })) <= 1;
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

    await Order._store.update({ _id: order._id }, order);
    return order;
  } catch (error) {
    console.error('Delivery processing error:', error.message);
    order.orderStatus = 'processing';
    order.paymentStatus = 'paid';
    await Order._store.update({ _id: order._id }, order);
    throw error;
  }
};

module.exports = { processOrderDelivery };
