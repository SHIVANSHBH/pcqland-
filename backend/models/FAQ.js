const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/FAQ');
} else {
  module.exports = require('../models-nedb/FAQ');
}
