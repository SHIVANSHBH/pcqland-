const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/Order');
} else {
  module.exports = require('../models-nedb/Order');
}