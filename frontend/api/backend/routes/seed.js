const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Seed endpoint disabled in production' });
    }
    const { isUsingMongo } = require('../config/db');
    if (!isUsingMongo()) {
      return res.status(400).json({ success: false, message: 'MongoDB not connected. Nothing to seed.' });
    }

    const Category = require('../models/Category');
    const Product = require('../models/Product');
    const Order = require('../models/Order');
    const Banner = require('../models/Banner');
    const FAQ = require('../models/FAQ');
    const Testimonial = require('../models/Testimonial');
    const Setting = require('../models/Setting');

    const path = require('path');
    const fs = require('fs');

    const dataDir = path.join(__dirname, '..', 'data');
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.db'));
    const results = {};

    for (const file of files) {
      const name = file.replace('.db', '');
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      const lines = content.trim().split('\n').filter(l => l.trim());
      const docs = lines.map(l => JSON.parse(l));

      let model;
      switch (name) {
        case 'User': continue;
        case 'Token': continue;
        case 'Category': model = Category; break;
        case 'Product': model = Product; break;
        case 'Order': model = Order; break;
        case 'Banner': model = Banner; break;
        case 'FAQ': model = FAQ; break;
        case 'Testimonial': model = Testimonial; break;
        case 'Setting': model = Setting; break;
        case 'Inventory': continue;
        default: continue;
      }

      for (const doc of docs) {
        const { _id, createdAt, updatedAt, ...data } = doc;
        try {
          await model.findByIdAndUpdate(_id, { $set: data }, { upsert: true, new: true });
        } catch (e) {
          try {
            const existing = await model.findOne({ _id });
            if (!existing) {
              data._id = _id;
              data.createdAt = createdAt || new Date().toISOString();
              data.updatedAt = updatedAt || new Date().toISOString();
              await model.create(data);
            }
          } catch (e2) {
            console.error(`Failed to seed ${name}/${_id}: ${e2.message}`);
          }
        }
      }
      results[name] = docs.length;
    }

    res.json({ success: true, message: 'Seed complete', data: results });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
