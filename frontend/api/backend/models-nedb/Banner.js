const { createModel } = require('../config/dev-store');

const Banner = createModel('Banner', {
  allowedFields: ['title', 'subtitle', 'image', 'link', 'isActive', 'displayOrder'],
  defaults: { isActive: true, displayOrder: 0 },
});

module.exports = Banner;
