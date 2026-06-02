const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/Token');
} else {
  module.exports = require('../models-nedb/Token');
}