const { createModel } = require('../config/dev-store');

const Token = createModel('Token', {
  allowedFields: ['token', 'type', 'userId', 'phone', 'expiresAt'],
  required: ['token', 'type'],
});

module.exports = Token;
