const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/Setting');
} else {
  module.exports = require('../models-nedb/Setting');
}