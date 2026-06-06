const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');

const router = express.Router();

const auth = (req, res, next) => {
  req.user = { _id: 'guest', role: 'customer' };
  next();
};

router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ balance: user.walletBalance, totalEarned: user.totalCashbackEarned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/transactions', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id, cashbackEarned: { $gt: 0 } })
        .select('orderId cashbackEarned amount createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: req.user._id, cashbackEarned: { $gt: 0 } }),
    ]);
    res.json({ data: orders, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
