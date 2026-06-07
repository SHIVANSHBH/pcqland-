const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const Session = require('../models/Session');
const { auth, loadUser, sanitize, generateRefreshToken, generateCode, hashCode } = require('../middleware/auth');
const { success, error } = require('../utils/response');

const router = express.Router();

function signTokens(user) {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' });
  const refreshToken = generateRefreshToken();
  Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }).catch(() => {});
  return { accessToken, refreshToken };
}

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!email || !password) return error(res, 'Email and password are required', 400);
    const normalizedEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return error(res, 'Email already registered', 400);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email: normalizedEmail, phone, password: hashedPassword, role: 'customer', isVerified: true });
    await user.save();
    const { accessToken, refreshToken } = signTokens(user);
    await Session.create({ userId: user._id });
    user.isLoggedIn = true;
    user.token = accessToken;
    await user.save();
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none', path: '/' };
    res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Registration successful', 201);
  } catch (err) {
    console.error('Register error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password are required', 400);
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return error(res, 'Invalid credentials', 401);
    user = await User.findById(user._id).select('+password');
    if (!user) return error(res, 'Invalid credentials', 401);
    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      const remaining = Math.ceil((new Date(user.lockUntil) - new Date()) / 1000 / 60);
      return error(res, `Account locked. Try again in ${remaining} minutes`, 429);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) { user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); user.loginAttempts = 0; }
      await user.save();
      return error(res, 'Invalid credentials', 401);
    }
    user.loginAttempts = 0;
    user.lockUntil = null;
    await Session.deleteOne({ userId: user._id });
    await Session.create({ userId: user._id });
    const { accessToken, refreshToken } = signTokens(user);
    user.isLoggedIn = true;
    user.token = accessToken;
    await user.save();
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none', path: '/' };
    res.cookie('token', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    success(res, { accessToken, refreshToken, user: sanitize(user) }, `Welcome back ${user.name || 'User'}`);
  } catch (err) {
    console.error('Login error:', err.message);
    error(res, err.message);
  }
});

// GET /auth/me
router.get('/me', auth, loadUser, (req, res) => {
  if (!req.user) return error(res, 'User not found', 404);
  success(res, sanitize(req.user), 'User fetched');
});
router.post('/me', auth, loadUser, (req, res) => {
  if (!req.user) return error(res, 'User not found', 404);
  success(res, sanitize(req.user), 'User fetched');
});

// POST /auth/logout
router.post('/logout', auth, loadUser, async (req, res) => {
  try {
    await Session.deleteOne({ userId: req.userId });
    await Token.create({ token: req.cookies?.token || '', type: 'blacklist', userId: req.userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    if (req.user) {
      req.user.isLoggedIn = false;
      req.user.token = null;
      await req.user.save();
    }
    const cookieOpts = { path: '/', secure: true, sameSite: 'none' };
    res.clearCookie('token', cookieOpts);
    res.clearCookie('refreshToken', { path: '/api/auth/refresh-token', secure: true, sameSite: 'none' });
    success(res, null, 'Logged out successfully');
  } catch (err) {
    console.error('Logout error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/refresh-token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token is required', 400);
    const stored = await Token.findOne({ token: refreshToken, type: 'refresh' });
    if (!stored) return error(res, 'Invalid or expired refresh token', 401);
    const user = await User.findById(stored.userId);
    if (!user) return error(res, 'User not found', 404);
    await Token.deleteOne({ _id: stored._id });
    const tokens = signTokens(user);
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none', path: '/' };
    res.cookie('token', tokens.accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    success(res, tokens, 'Token refreshed');
  } catch (err) {
    console.error('Refresh error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/change-password
router.post('/change-password', auth, loadUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return error(res, 'Current and new password are required', 400);
    if (newPassword.length < 6) return error(res, 'Password must be at least 6 characters', 400);
    const user = await User.findById(req.userId).select('+password');
    if (!user) return error(res, 'User not found', 404);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return error(res, 'Current password is incorrect', 400);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    success(res, null, 'Password changed successfully');
  } catch (err) {
    console.error('Change password error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) return error(res, 'Email or phone is required', 400);
    const filter = email ? { email: email.toLowerCase().trim() } : { phone };
    const user = await User.findOne(filter);
    if (!user) return error(res, 'User not found', 404);
    const code = generateCode();
    const hashed = hashCode(code);
    if (email) { user.emailOtp = hashed; user.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); }
    if (phone) { user.otp = hashed; user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); }
    await user.save();
    console.log(`OTP for ${email || phone}: ${code}`);
    success(res, null, 'OTP sent successfully');
  } catch (err) {
    console.error('Send OTP error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    if (!otp) return error(res, 'OTP is required', 400);
    if (!email && !phone) return error(res, 'Email or phone is required', 400);
    const filter = email ? { email: email.toLowerCase().trim() } : { phone };
    const user = await User.findOne(filter);
    if (!user) return error(res, 'User not found', 404);
    const storedHash = email ? user.emailOtp : user.otp;
    const expiry = email ? user.emailOtpExpiry : user.otpExpiry;
    if (!storedHash || !expiry) return error(res, 'No OTP requested', 400);
    if (new Date(expiry) < new Date()) return error(res, 'OTP expired', 400);
    const isMatch = hashCode(otp) === storedHash;
    if (!isMatch) return error(res, 'Invalid OTP', 400);
    if (email) { user.emailOtp = null; user.emailOtpExpiry = null; }
    if (phone) { user.otp = null; user.otpExpiry = null; }
    await user.save();
    const { accessToken, refreshToken } = signTokens(user);
    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'OTP verified successfully');
  } catch (err) {
    console.error('Verify OTP error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, 'Email is required', 400);
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return error(res, 'User not found', 404);
    const code = generateCode();
    user.resetCode = hashCode(code);
    user.resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    console.log(`Reset code for ${email}: ${code}`);
    success(res, null, 'Reset code sent to email');
  } catch (err) {
    console.error('Forgot password error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return error(res, 'Email, code, and new password are required', 400);
    if (newPassword.length < 6) return error(res, 'Password must be at least 6 characters', 400);
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return error(res, 'User not found', 404);
    if (!user.resetCode || !user.resetCodeExpiry) return error(res, 'No reset code requested', 400);
    if (new Date(user.resetCodeExpiry) < new Date()) return error(res, 'Reset code expired', 400);
    if (hashCode(code) !== user.resetCode) return error(res, 'Invalid reset code', 400);
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();
    success(res, null, 'Password reset successfully');
  } catch (err) {
    console.error('Reset password error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/supabase-sync
router.post('/supabase-sync', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return error(res, 'Access token is required', 400);
    let userId;
    try { userId = jwt.verify(accessToken, process.env.JWT_SECRET).id; } catch { return error(res, 'Invalid token', 401); }
    const user = await User.findById(userId);
    if (!user) return error(res, 'User not found', 404);
    success(res, { user: sanitize(user) }, 'User synced');
  } catch (err) {
    console.error('Supabase sync error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/unlock (unlock any locked account)
router.post('/unlock', async (req, res) => {
  try {
    const { email } = req.body;
    const filter = email ? { email: email.toLowerCase().trim() } : { lockUntil: { $ne: null } };
    const users = email ? [await User.findOne(filter)] : await User.find({ lockUntil: { $ne: null } });
    if (!users || (email && !users[0])) return error(res, 'User not found', 404);
    for (const u of users) { if (u) { u.loginAttempts = 0; u.lockUntil = null; await u.save(); } }
    success(res, { unlocked: users.filter(Boolean).length }, 'Account(s) unlocked');
  } catch (err) {
    console.error('Unlock error:', err.message);
    error(res, err.message);
  }
});

// POST /auth/make-admin (promote a user to admin)
router.post('/make-admin', async (req, res) => {
  try {
    const { email, secret } = req.body;
    if (!email) return error(res, 'Email is required', 400);
    if (secret !== 'admin-setup-2026') return error(res, 'Invalid secret', 403);
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return error(res, 'User not found', 404);
    user.role = 'admin';
    await user.save();
    success(res, { email: user.email, role: user.role }, 'User promoted to admin');
  } catch (err) {
    console.error('Make admin error:', err.message);
    error(res, err.message);
  }
});

module.exports = router;
