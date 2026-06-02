const { z } = require('zod');

function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      const message = err.errors ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') : err.message;
      res.status(400).json({ success: false, message });
    }
  };
}

module.exports = { validate, z };