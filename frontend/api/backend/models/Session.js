const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/Session');
} else {
  module.exports = require('../models-nedb/Session');
}
