const mongoose = require('mongoose');

let useNeDB = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pcdeals';
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.log('Falling back to NeDB (file-based database)');
    useNeDB = true;
  }
};

const isUsingNeDB = () => useNeDB;

module.exports = connectDB;
module.exports.isUsingNeDB = isUsingNeDB;
