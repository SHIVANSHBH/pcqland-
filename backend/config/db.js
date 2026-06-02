let mongoose;
try {
  mongoose = require('mongoose');
} catch {
  mongoose = null;
}

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI set, using NeDB (file-based database)');
    return;
  }
  if (!mongoose) {
    console.log('Mongoose not available, using NeDB');
    return;
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isMongoConnected = true;
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    console.log('Falling back to NeDB (file-based database)');
  }
};

const isUsingMongo = () => isMongoConnected;

module.exports = connectDB;
module.exports.isUsingMongo = isUsingMongo;