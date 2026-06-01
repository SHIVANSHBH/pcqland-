const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search, featured, page: pageStr, limit: limitStr } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);
      filter.name = { $regex: sanitized, $options: 'i' };
    }
    if (featured === 'true') filter.isFeatured = true;

    const page = Math.max(1, parseInt(pageStr) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr) || 20));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).populate('category', 'name slug'),
      Product.countDocuments(filter),
    ]);
    res.json({ data: products, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
