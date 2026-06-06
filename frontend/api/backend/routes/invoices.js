const express = require('express');
const path = require('path');
const fs = require('fs');
const auth = (req, res, next) => { req.user = { _id: 'guest', role: 'customer', name: 'Guest', email: 'guest@localhost' }; next(); };
const Order = require('../models/Order');

const router = express.Router();

router.get('/:filename', auth, async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    if (!/^[\w\-. ]+$/.test(filename) || filename.includes('..')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    const orderId = filename.replace('invoice_', '').replace('.pdf', '');
    const order = await Order.findOne({ orderId }).select('user');
    if (!order) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const invoicesDir = path.resolve(__dirname, '..', 'invoices');
    const tmpDir = '/tmp/invoices';
    const dir = fs.existsSync(invoicesDir) ? invoicesDir : (fs.existsSync(tmpDir) ? tmpDir : null);
    if (!dir) return res.status(404).json({ message: 'Invoice not found' });

    const filePath = path.resolve(dir, filename);
    if (!filePath.startsWith(dir)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
