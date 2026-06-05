const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');
const { getAdminClient } = require('../config/supabase');

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

async function verifySupabaseToken(token) {
  const supabase = getAdminClient();
  if (!supabase) return null;
  try {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    if (error || !supabaseUser) return null;
    return supabaseUser;
  } catch {
    return null;
  }
}

async function findOrCreateMongoUser(supabaseUser) {
  const supabaseId = supabaseUser.id;
  const email = supabaseUser.email?.toLowerCase();
  const name = supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User';
  const phone = supabaseUser.phone || null;

  let mongoUser = await User.findOne({ supabaseId });
  if (mongoUser) return mongoUser;

  mongoUser = email ? await User.findOne({ email }) : null;
  if (mongoUser) {
    mongoUser.supabaseId = supabaseId;
    if (phone) mongoUser.phone = phone;
    if (!mongoUser.isVerified) mongoUser.isVerified = true;
    await mongoUser.save();
    return mongoUser;
  }

  mongoUser = await User.create({
    name,
    email,
    phone,
    supabaseId,
    role: 'customer',
    isVerified: true,
  });
  return mongoUser;
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

    const supabaseUser = await verifySupabaseToken(token);
    if (supabaseUser) {
      const mongoUser = await findOrCreateMongoUser(supabaseUser);
      req.user = sanitize(mongoUser);
      req.token = token;
      req.authProvider = 'supabase';
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = sanitize(user);
    req.token = token;
    req.authProvider = 'jwt';
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
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return (crypto.randomInt(min, max + 1)).toString();
}

function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

module.exports = { auth, adminAuth, sanitize, generateRefreshToken, generateCode, hashCode };
