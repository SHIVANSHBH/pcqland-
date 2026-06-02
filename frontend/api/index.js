const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const passport = require('passport');

const app = express();

app.use(compression());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  message: { success: false, message: 'Too many attempts' },
  standardHeaders: true, legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 100,
  message: { success: false, message: 'Too many requests' },
  standardHeaders: true, legacyHeaders: false,
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 20,
  message: { success: false, message: 'Too many orders' },
  standardHeaders: true, legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, max: 3,
  message: { success: false, message: 'Too many OTP requests' },
  standardHeaders: true, legacyHeaders: false,
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://pcqland.vercel.app',
  credentials: true,
}));

app.use(cookieParser());

app.use((req, res, next) => {
  const csrfExempt = ['/api/admin/upload', '/api/admin/inventory/upload'];
  if (csrfExempt.some(p => req.path.startsWith(p))) return next();
  if (!req.cookies.csrf_token) {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false, secure: true, sameSite: 'strict', path: '/',
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

app.use(passport.initialize());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev'));

app.use('/api/auth', authLimiter);
app.use('/api/orders', orderLimiter);
app.use('/api/wallet', orderLimiter);
app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/auth/verify-otp', otpLimiter);
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

if (!process.env.DB_PATH && process.env.VERCEL) {
  process.env.DB_PATH = '/tmp/data';
}

let initialized = false;

async function init() {
  if (initialized) return;
  const connectDB = require('../../backend/config/db');
  await connectDB();
  app.use('/api/auth', require('../../backend/routes/auth'));
  app.use('/api/categories', require('../../backend/routes/categories'));
  app.use('/api/products', require('../../backend/routes/products'));
  app.use('/api/orders', require('../../backend/routes/orders'));
  app.use('/api/wallet', require('../../backend/routes/wallet'));
  app.use('/api/cms', require('../../backend/routes/cms'));
  app.use('/api/admin', require('../../backend/routes/admin'));
  app.use('/api/invoices', require('../../backend/routes/invoices'));
  initialized = true;
}

module.exports = async (req, res) => {
  if (req.url === '/api/health') {
    return res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
  }
  try {
    await init();
    return app(req, res);
  } catch (err) {
    console.error('API init error:', err);
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
};
