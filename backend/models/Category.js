const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/Category');
} else {
  module.exports = require('../models-nedb/Category');
}