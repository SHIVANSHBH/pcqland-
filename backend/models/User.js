const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/User');
} else {
  module.exports = require('../models-nedb/User');
}