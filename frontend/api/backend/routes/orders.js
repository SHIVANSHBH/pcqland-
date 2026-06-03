const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../utils/razorpay');
const { processOrderDelivery } = require('../utils/delivery');

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  try {
    const { items, customerInfo, paymentMethod } = req.body;
    const Product = require('../models/Product');
    const Inventory = require('../models/Inventory');

    // Check inventory availability before processing
    for (const item of items) {
      const productId = item.productId;
      if (!productId && item.slug) {
        const found = await Product.findOne({ slug: item.slug });
        if (found) {
          item.productId = found._id;
        }
      }
      const pid = item.productId;
      if (pid) {
        const available = await Inventory.countDocuments({ product: pid, isUsed: false });
        if (available < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient keys for ${item.name || item.slug || 'product'}. Only ${available} available, requested ${item.quantity}.`,
          });
        }
      }
    }

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      let product;
      if (item.productId) {
        product = await Product.findById(item.productId);
      }
      if (!product && item.slug) {
        const allProducts = await Product.find({ slug: item.slug });
        product = allProducts[0] || null;
      }
      if (product) {
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        orderItems.push({
          product: product._id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal,
        });
      } else {
        const price = item.price || 0;
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;
        orderItems.push({
          product: item.slug || item.productId,
          productName: item.name || item.slug || 'Product',
          quantity: item.quantity,
          unitPrice: price,
          totalPrice: itemTotal,
        });
      }
    }

    const user = await User.findById(req.user._id);
    let cashbackUsed = 0;
    let prepaidDiscount = 0;

    if (paymentMethod === 'wallet' && user.walletBalance > 0) {
      cashbackUsed = Math.min(user.walletBalance, subtotal);
    }

    const taxRate = parseFloat(process.env.TAX_RATE) || 0.18;
    const tax = Math.round((subtotal - cashbackUsed) * taxRate * 100) / 100;
    const amount = subtotal - cashbackUsed - prepaidDiscount + tax;

    const orderId = 'PCD' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();

    let razorpayOrder = null;
    if (paymentMethod === 'razorpay') {
      razorpayOrder = await createOrder(amount, orderId);
    }

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      orderId,
      razorpayOrderId: razorpayOrder?.id,
      amount: Math.round(amount * 100) / 100,
      subtotal,
      cashbackUsed,
      prepaidDiscount,
      tax,
      paymentMethod,
      customerInfo,
      deliveryEmail: customerInfo?.email || user.email,
      deliveryPhone: customerInfo?.phone || user.phone,
    });

    if (cashbackUsed > 0) {
      await User.findByIdAndUpdate(user._id, { $inc: { walletBalance: -cashbackUsed } });
    }

    res.status(201).json({
      order,
      razorpayOrder: razorpayOrder ? {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      } : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }
    const order = await Order.findOne({ razorpayOrderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    order.razorpayPaymentId = razorpayPaymentId;

    await processOrderDelivery(order);

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name slug images'),
      Order.countDocuments({ user: req.user._id }),
    ]);
    res.json({ data: orders, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, user: req.user._id })
      .populate('items.product', 'name slug images');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
