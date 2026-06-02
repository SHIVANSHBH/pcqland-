require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Compression
app.use(compression());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many orders, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many OTP requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Cookie parser
app.use(cookieParser());

// CSRF protection (double-submit cookie pattern)
app.use((req, res, next) => {
  if (!req.cookies.csrf_token) {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }

  const dangerousMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (dangerousMethods.includes(req.method)) {
    const headerToken = req.headers['x-csrf-token'];
    const cookieToken = req.cookies.csrf_token;
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      return res.status(403).json({ success: false, message: 'Invalid CSRF token' });
    }
  }
  next();
});

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api/orders', orderLimiter);
app.use('/api/wallet', orderLimiter);
app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/auth/verify-otp', otpLimiter);
app.use('/api', apiLimiter);

// Health check (no DB needed)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;

async function main() {
  await connectDB();

  // Routes (loaded after DB connection so models know which backend to use)
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/categories', require('./routes/categories'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/wallet', require('./routes/wallet'));
  app.use('/api/cms', require('./routes/cms'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/invoices', require('./routes/invoices'));

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  });

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!require('./config/db').isUsingMongo()) {
      console.log('⚠️  Using NeDB (file-based). Set MONGODB_URI for production.');
    }
  });

  function gracefulShutdown(signal) {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000).unref();
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

main().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;