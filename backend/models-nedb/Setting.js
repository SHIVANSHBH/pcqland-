const { createModel } = require('../config/dev-store');

const Setting = createModel('Setting', {
  allowedFields: ['key', 'value'],
  required: ['key'],
});

module.exports = Setting;
