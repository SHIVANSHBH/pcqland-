const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

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
    const orders = await Order.find({ user: req.user._id, cashbackEarned: { $gt: 0 } })
      .select('orderId cashbackEarned amount createdAt')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
