let mongoose;
try {
  mongoose = require('mongoose');
} catch {
  mongoose = null;
}

let isMongoConnected = false;

function maskUri(uri) {
  return uri.replace(/\/\/[^:]+:([^@]+)@/, '//USER:***MASKED***@');
}

function ensureDbName(uri) {
  try {
    const url = new URL(uri);
    if (!url.pathname || url.pathname === '/' || !url.pathname.slice(1)) {
      url.pathname = '/pcqland';
      return url.toString();
    }
  } catch {}
  return uri;
}

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    console.log('No MONGODB_URI set, using NeDB (file-based database)');
    return;
  }
  if (!mongoose) {
    console.log('Mongoose not available, using NeDB');
    return;
  }

  const uri = ensureDbName(rawUri);
  if (uri !== rawUri) {
    console.log('MONGODB_URI missing database name, added /pcqland');
  }

  console.log(`Connecting to MongoDB: ${maskUri(uri)}`);
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    });
    isMongoConnected = true;
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    if (err.message.includes('Authentication failed')) {
      console.error('👉 Check your MongoDB username and password in MONGODB_URI');
      console.error('👉 Password must be URL-encoded if it contains special chars (@ : / ? #)');
    } else if (err.message.includes('getaddrinfo') || err.message.includes('ENOTFOUND')) {
      console.error('👉 Cannot resolve MongoDB host. Check your cluster hostname in MONGODB_URI');
    } else if (err.message.includes('timed out') || err.message.includes('TIMEOUT')) {
      console.error('👉 Connection timed out. Add 0.0.0.0/0 to MongoDB Atlas Network Access whitelist');
      console.error('👉 https://cloud.mongodb.com → Network Access → Add IP 0.0.0.0/0');
    }
    console.log('Falling back to NeDB (file-based database)');
  }
};

const isUsingMongo = () => isMongoConnected;

module.exports = connectDB;
module.exports.isUsingMongo = isUsingMongo;