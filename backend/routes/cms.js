const express = require('express');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Banner = require('../models/Banner');
const USP = require('../models/USP');

const router = express.Router();

router.get('/testimonials', async (req, res) => {
  try {
    const data = await Testimonial.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/faqs', async (req, res) => {
  try {
    const data = await FAQ.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/banners', async (req, res) => {
  try {
    const data = await Banner.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/usps', async (req, res) => {
  try {
    const data = await USP.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
