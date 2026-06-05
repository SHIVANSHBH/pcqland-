require('dotenv').config();
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const connectDB = require('./config/db');

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason instanceof Error ? reason.stack : reason);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.stack);
  process.exit(1);
});

const app = express();

// Compression
app.use(compression());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: (req) => req.method === 'GET' || req.method === 'HEAD',
  message: { success: false, message: 'Too many attempts, please wait 15 minutes before trying again' },
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
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'https://pcqland.vercel.app',
  /^https:\/\/pcqland-.*\.vercel\.app$/,
].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some(o => (typeof o === 'string' ? o === origin : o.test(origin)))) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Cookie parser
app.use(cookieParser());

// CSRF protection (double-submit cookie pattern)
app.use((req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer ')) return next();

  const csrfExempt = ['/api/seed', '/api/admin/upload', '/api/admin/inventory/upload', '/api/admin/settings'];
  if (csrfExempt.some(p => req.path.startsWith(p))) return next();

  if (!req.cookies.csrf_token) {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
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

// Passport
app.use(passport.initialize());

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
if (process.env.RENDER || process.env.VERCEL) {
  const tmpInvoiceDir = '/tmp/invoices';
  if (!require('fs').existsSync(tmpInvoiceDir)) require('fs').mkdirSync(tmpInvoiceDir, { recursive: true });
  app.use('/invoices', express.static(tmpInvoiceDir));
}

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api/orders', orderLimiter);
app.use('/api/wallet', orderLimiter);
app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/auth/verify-otp', otpLimiter);
app.use('/api/auth/reset-password', otpLimiter);
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  let dbInfo = 'nedb';
  try {
    const db = require('./config/db');
    if (db.isUsingMongo && db.isUsingMongo()) {
      const mongoose = require('mongoose');
      dbInfo = `mongodb:${mongoose.connection.name || 'unknown'}`;
    }
  } catch {}
  res.json({
    status: 'ok',
    database: dbInfo,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const PORT = process.env.PORT || 5000;

async function main() {
  await connectDB();

  // Serve frontend static build if it exists (production mode)
  const frontendDist = path.join(__dirname, '..', '..', '..', 'frontend');
  const nextBuildDir = path.join(frontendDist, '.next');
  if (require('fs').existsSync(nextBuildDir)) {
    app.use('/_next', express.static(path.join(nextBuildDir)));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/') || req.path.startsWith('/invoices/')) return next();
      res.sendFile(path.join(nextBuildDir, 'server', 'pages', 'index.html'), err => {
        if (err) res.sendFile(path.join(nextBuildDir, 'server', 'app', 'index.html'), err2 => {
          if (err2) next();
        });
      });
    });
  }

  // Routes (loaded after DB connection so models know which backend to use)
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/categories', require('./routes/categories'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/wallet', require('./routes/wallet'));
  app.use('/api/cms', require('./routes/cms'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/invoices', require('./routes/invoices'));
  app.use('/api/seed', require('./routes/seed'));

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