const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');

function sanitize(user) {
  if (!user) return user;
  if (typeof user.toObject === 'function') {
    const obj = user.toObject();
    delete obj.password;
    return obj;
  }
  const { password, ...rest } = user;
  return rest;
}

const auth = async (req, res, next) => {
  try {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const blacklisted = await Token.findOne({ token, type: 'blacklist' });
    if (blacklisted) {
      return res.status(401).json({ success: false, message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = sanitize(user);
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const adminAuth = async (req, res, next) => {
  await auth(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
  });
};

function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

function generateCode(length = 6) {
  return Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)).toString();
}

module.exports = { auth, adminAuth, sanitize, generateRefreshToken, generateCode };
