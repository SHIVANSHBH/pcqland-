const { createModel } = require('../config/dev-store');

const Category = createModel('Category', {
  allowedFields: ['name', 'slug', 'description', 'icon', 'isActive', 'displayOrder'],
  required: ['name', 'slug'],
  defaults: { isActive: true, displayOrder: 0 },
});

module.exports = Category;
