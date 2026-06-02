const { createModel } = require('../config/dev-store');

const Inventory = createModel('Inventory', {
  allowedFields: ['product', 'key', 'validity', 'isUsed', 'order', 'usedAt'],
  required: ['product', 'key'],
  defaults: { isUsed: false },
});

module.exports = Inventory;
