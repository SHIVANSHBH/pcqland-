const express = require('express');
const multer = require('multer');
const csv = require('csv-parse/sync');

const adminAuth = (req, res, next) => { req.user = { _id: 'admin', role: 'admin', name: 'Admin', email: 'admin@localhost' }; next(); };

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Banner = require('../models/Banner');
const USP = require('../models/USP');
const Setting = require('../models/Setting');
const { processOrderDelivery } = require('../utils/delivery');
const cache = require('../utils/cache');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (req.path === '/inventory/upload') {
      return cb(null, /csv/.test(file.mimetype) || file.originalname.endsWith('.csv'));
    }
    const allowed = /jpeg|jpg|png|gif|webp|svg|ico/;
    const ext = allowed.test(file.originalname.toLowerCase().split('.').pop());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

// Auth (disabled)
router.post('/login', async (req, res) => {
  res.json({ success: true, data: { user: { _id: 'admin', name: 'Admin', email: 'admin@localhost', role: 'admin' }, accessToken: 'mock-token' } });
});
    res.json({ success: true, message: 'Login successful', data: { accessToken, refreshToken, user: sanitize(user) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Dashboard
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [totalOrders, totalRevenue, ordersToday, pendingKeys, usersCount] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Order.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }),
      Inventory.countDocuments({ isUsed: false }),
      User.countDocuments({ role: 'customer' }),
    ]);
    const walletLiability = await User.aggregate([
      { $match: { role: 'customer' } },
      { $group: { _id: null, total: { $sum: '$walletBalance' } } },
    ]);
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersToday,
      pendingKeys,
      usersCount,
      walletLiability: walletLiability[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Products
router.get('/products', adminAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find().populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);
    res.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/products', adminAuth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Categories
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/categories', adminAuth, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/categories/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/categories/:id', adminAuth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Inventory
router.get('/inventory', adminAuth, async (req, res) => {
  try {
    const { product } = req.query;
    const filter = {};
    if (product) filter.product = product;
    const items = await Inventory.find(filter).populate('product', 'name slug').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/inventory/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Inventory.aggregate([
      { $group: { _id: '$product', total: { $sum: 1 }, used: { $sum: { $cond: ['$isUsed', 1, 0] } } } },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { productName: '$product.name', total: 1, used: 1, available: { $subtract: ['$total', '$used'] } } },
      { $sort: { available: 1 } },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/inventory/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    const { productId } = req.body;
    const fs = require('fs');
    const csvContent = fs.readFileSync(req.file.path, 'utf-8');
    const records = csv.parse(csvContent, { columns: true, skip_empty_lines: true, relax_column_count: true });
    const keys = records.map(r => ({
      product: productId,
      key: r.key || r.Key || r.KEY || Object.values(r)[0],
      validity: r.validity || r.Validity || '',
    })).filter(r => r.key);
    await Inventory.insertMany(keys);
    fs.unlinkSync(req.file.path);
    res.status(201).json({ count: keys.length, message: `${keys.length} keys uploaded` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Order.countDocuments(filter);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/orders/:id/resend', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const { resendDelivery } = require('../utils/delivery');
    await resendDelivery(order);
    res.json({ success: true, message: 'Keys resent via email and WhatsApp' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/orders/:id/refund', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'refunded') {
      return res.status(400).json({ success: false, message: 'Order already refunded' });
    }

    // Process Razorpay refund if applicable
    if (order.razorpayPaymentId) {
      try {
        const Razorpay = require('razorpay');
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        await razorpay.payments.refund(order.razorpayPaymentId);
      } catch (rpErr) {
        console.error('Razorpay refund error:', rpErr.message);
      }
    }

    order.paymentStatus = 'refunded';
    order.orderStatus = 'refunded';
    await Order.findByIdAndUpdate(order._id, { orderStatus: 'refunded', paymentStatus: 'refunded' });
    if (order.cashbackEarned > 0) {
      await User.findByIdAndUpdate(order.user, { $inc: { walletBalance: -order.cashbackEarned } });
    }
    res.json({ success: true, message: 'Order refunded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id/wallet', adminAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== 'number' || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { $inc: { walletBalance: amount } }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CMS
router.get('/testimonials', adminAuth, async (req, res) => {
  try {
    const data = await Testimonial.find().sort({ displayOrder: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/testimonials', adminAuth, async (req, res) => {
  try {
    const data = await Testimonial.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/testimonials/:id', adminAuth, async (req, res) => {
  try {
    const data = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/testimonials/:id', adminAuth, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/faqs', adminAuth, async (req, res) => {
  try {
    const data = await FAQ.find().sort({ displayOrder: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/faqs', adminAuth, async (req, res) => {
  try {
    const data = await FAQ.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/faqs/:id', adminAuth, async (req, res) => {
  try {
    const data = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/faqs/:id', adminAuth, async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/banners', adminAuth, async (req, res) => {
  try {
    const data = await Banner.find().sort({ displayOrder: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/banners', adminAuth, async (req, res) => {
  try {
    const data = await Banner.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/banners/:id', adminAuth, async (req, res) => {
  try {
    const data = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/banners/:id', adminAuth, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/usps', adminAuth, async (req, res) => {
  try {
    const data = await USP.find().sort({ displayOrder: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/usps', adminAuth, async (req, res) => {
  try {
    const data = await USP.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/usps/:id', adminAuth, async (req, res) => {
  try {
    const data = await USP.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/usps/:id', adminAuth, async (req, res) => {
  try {
    await USP.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Settings (public read for frontend display, cached 5 min)
router.get('/settings', async (req, res) => {
  const cached = cache.get('settings');
  if (cached) return res.json(cached);
  const settings = await Setting.find();
  const obj = {};
  settings.forEach(s => { obj[s.key] = s.value; });
  cache.set('settings', obj, 300000);
  res.json(obj);
});

router.put('/settings', adminAuth, async (req, res) => {
  try {
    const { key, value } = req.body;
    await Setting.findOneAndUpdate({ key }, { value }, { upsert: true });
    cache.del('settings');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// File Upload
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
