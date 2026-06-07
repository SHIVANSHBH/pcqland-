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
    throw new Error('MONGODB_URI not set — add it to Render environment variables');
  }
  if (!mongoose) {
    throw new Error('Mongoose not available');
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
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    }
    isMongoConnected = true;
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    const msg = err.message;
    console.error(`MongoDB connection error: ${msg}`);
    if (msg.includes('querySrv') || msg.includes('ENOTFOUND')) {
      const hostMatch = msg.match(/_mongodb\._tcp\.(\S+)/);
      const host = hostMatch ? hostMatch[1] : (() => { try { return new URL(uri.replace(/^mongodb\+srv:/, 'mongodb:')).hostname; } catch { return 'unknown'; } })();
      console.error(`👉 SRV lookup failed for host: ${host}`);
      console.error(`👉 Go to MongoDB Atlas → Cluster → Connect → "Connect your application"`);
      console.error(`👉 Copy the exact mongodb+srv:// URI and set it as MONGODB_URI in Render dashboard`);
      console.error(`👉 Your cluster might have been deleted or its hostname changed`);
    } else if (msg.includes('Authentication failed')) {
      console.error('👉 Check your MongoDB username and password in MONGODB_URI');
      console.error('👉 Password must be URL-encoded if it contains special chars (@ : / ? #)');
    } else if (msg.includes('timed out') || msg.includes('TIMEOUT')) {
      console.error('👉 Connection timed out. Add 0.0.0.0/0 to MongoDB Atlas Network Access whitelist');
      console.error('👉 https://cloud.mongodb.com → Network Access → Add IP 0.0.0.0/0');
    }
    if (!isMongoConnected) {
      throw new Error(`MongoDB connection failed: ${msg}`);
    }
  }
};

const isUsingMongo = () => isMongoConnected;

module.exports = connectDB;
module.exports.isUsingMongo = isUsingMongo;