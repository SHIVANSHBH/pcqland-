const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/USP');
} else {
  module.exports = require('../models-nedb/USP');
}
