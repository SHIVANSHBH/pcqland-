const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');

function auth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.user = null;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

async function loadUser(req, res, next) {
  if (!req.userId) return next();
  try {
    req.user = await User.findById(req.userId);
    next();
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to load user' });
  }
}

async function adminAuth(req, res, next) {
  await auth(req, res, (err) => {
    if (err) return;
    if (!req.userId) return;
  });
  if (!req.userId) return;
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(500).json({ success: false, message: 'Failed to verify admin' });
  }
}

function sanitize(user) {
  if (!user) return null;
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  delete obj.verificationCode;
  delete obj.verificationCodeExpiry;
  delete obj.resetCode;
  delete obj.resetCodeExpiry;
  delete obj.otp;
  delete obj.otpExpiry;
  delete obj.emailOtp;
  delete obj.emailOtpExpiry;
  delete obj.token;
  return obj;
}

function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

function generateCode(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(crypto.randomInt(min, max + 1));
}

function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

module.exports = { auth, loadUser, adminAuth, sanitize, generateRefreshToken, generateCode, hashCode };
