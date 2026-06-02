const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/Product');
} else {
  module.exports = require('../models-nedb/Product');
}