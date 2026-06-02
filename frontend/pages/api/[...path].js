let handler;

module.exports = async (req, res) => {
  if (!handler) handler = require('../../../api/index');
  return handler(req, res);
};