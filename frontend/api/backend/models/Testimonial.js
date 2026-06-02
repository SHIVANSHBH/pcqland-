const { isUsingMongo } = require('../config/db');

if (isUsingMongo()) {
  module.exports = require('./mongo/Testimonial');
} else {
  module.exports = require('../models-nedb/Testimonial');
}
