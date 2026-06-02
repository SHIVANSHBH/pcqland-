const { createModel } = require('../config/dev-store');

const USP = createModel('USP', {
  allowedFields: ['title', 'description', 'icon', 'isActive', 'displayOrder'],
  defaults: { isActive: true, displayOrder: 0 },
});

module.exports = USP;
