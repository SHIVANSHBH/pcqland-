const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const app = express();

app.use(compression());

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

app.use(cookieParser());

app.use((req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer ')) return next();

  const csrfExempt = ['/api/seed', '/api/admin/upload', '/api/admin/inventory/upload', '/api/admin/settings'];
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

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev'));

app.use('/api/orders', orderLimiter);
app.use('/api/wallet', orderLimiter);
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

const fs = require('fs');
const path = require('path');

if (!process.env.DB_PATH && process.env.VERCEL) {
  process.env.DB_PATH = '/tmp/data';
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

async function init() {
  if (initialized) return;
  const connectDB = require('./backend/config/db');
  await connectDB();
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
  }
}

module.exports = async (req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() }));
  }
  try {
    await init();
    return app(req, res);
  } catch (err) {
    console.error('API init error:', err);
    console.error('API init error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: err.message, ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }) }));
  }
};
