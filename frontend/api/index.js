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
  const csrfExempt = ['/api/auth/csrf', '/api/admin/upload', '/api/admin/inventory/upload'];
  if (csrfExempt.some(p => req.path.startsWith(p))) return next();
  if (!req.cookies.csrf_token) {
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false, secure: true, sameSite: 'none', path: '/',
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

const fs = require('fs');
const path = require('path');

if (!process.env.DB_PATH && process.env.VERCEL) {
  process.env.DB_PATH = '/tmp/data';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'e78a710567b02f149b97a499aba3808fe536cfdb6198e2eba167cccc8cdf2811';
}

let initialized = false;

async function seedDataDir() {
  const srcDir = path.join(__dirname, 'backend', 'data');
  const dstDir = process.env.DB_PATH || srcDir;
  if (srcDir === dstDir) return;
  if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.db'));
  for (const file of files) {
    const dst = path.join(dstDir, file);
    if (!fs.existsSync(dst)) {
      fs.copyFileSync(path.join(srcDir, file), dst);
    }
  }
}

async function seedAdmin() {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./backend/models/User');
    const existing = await User.findOne({ role: 'admin' });
    if (!existing) {
      const hashed = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@pcdeals.com',
        phone: '9999999999',
        password: hashed,
        role: 'admin',
        isVerified: true,
      });
      console.log('Admin user seeded on cold start');
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
}

async function init() {
  if (initialized) return;
  const connectDB = require('./backend/config/db');
  await connectDB();
  app.use('/api/auth', require('./backend/routes/auth'));
  app.use('/api/categories', require('./backend/routes/categories'));
  app.use('/api/products', require('./backend/routes/products'));
  app.use('/api/orders', require('./backend/routes/orders'));
  app.use('/api/wallet', require('./backend/routes/wallet'));
  app.use('/api/cms', require('./backend/routes/cms'));
  app.use('/api/admin', require('./backend/routes/admin'));
  app.use('/api/invoices', require('./backend/routes/invoices'));
  app.use('/api/seed', require('./backend/routes/seed'));
  initialized = true;
  if (process.env.VERCEL) {
    await seedDataDir();
    await seedAdmin();
  }
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
