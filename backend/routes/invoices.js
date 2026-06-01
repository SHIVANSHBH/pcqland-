const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'invoices', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
});

module.exports = router;
