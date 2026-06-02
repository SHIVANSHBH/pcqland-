const { createModel } = require('../config/dev-store');

const Testimonial = createModel('Testimonial', {
  allowedFields: ['name', 'rating', 'text', 'image', 'isActive', 'displayOrder'],
  defaults: { isActive: true, displayOrder: 0 },
});

module.exports = Testimonial;
