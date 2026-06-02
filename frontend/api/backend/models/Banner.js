const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/Banner');
} else {
  module.exports = require('../models-nedb/Banner');
}
