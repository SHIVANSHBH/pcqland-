const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  if (!/^[\w\-. ]+$/.test(filename) || filename.includes('..')) {
    return res.status(400).json({ message: 'Invalid filename' });
  }
  const invoicesDir = path.resolve(__dirname, '..', 'invoices');
  const filePath = path.resolve(invoicesDir, filename);
  if (!filePath.startsWith(invoicesDir)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
});

module.exports = router;
