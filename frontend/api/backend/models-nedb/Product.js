const { createModel } = require('../config/dev-store');

const Product = createModel('Product', {
  allowedFields: ['name', 'slug', 'description', 'shortDescription', 'price', 'mrp', 'discount', 'images', 'category', 'validity', 'tags', 'isActive', 'isFeatured'],
  required: ['name', 'slug', 'price'],
  defaults: { isActive: true, isFeatured: false, images: [], tags: [] },
});

module.exports = Product;
