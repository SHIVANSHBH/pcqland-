const { createModel } = require('../config/dev-store');

const Session = createModel('Session', {
  allowedFields: ['userId'],
  required: ['userId'],
});

module.exports = Session;
