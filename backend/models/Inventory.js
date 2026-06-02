const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/Inventory');
} else {
  module.exports = require('../models-nedb/Inventory');
}