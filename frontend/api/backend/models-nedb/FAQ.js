const { createModel } = require('../config/dev-store');

const FAQ = createModel('FAQ', {
  allowedFields: ['question', 'answer', 'isActive', 'displayOrder'],
  defaults: { isActive: true, displayOrder: 0 },
});

module.exports = FAQ;
