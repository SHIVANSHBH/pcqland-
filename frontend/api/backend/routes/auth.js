const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const Session = require('../models/Session');
const { auth, adminAuth, sanitize, generateRefreshToken, generateCode, hashCode } = require('../middleware/auth');
const { validate, z } = require('../middleware/validate');
const { success, error } = require('../utils/response');
const { sendGenericEmail } = require('../utils/email');
const { verificationEmail, passwordResetEmail } = require('../utils/templates');

const router = express.Router();

function signTokens(user) {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' });
  const refreshToken = generateRefreshToken();
  Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }).catch(() => {});
  return { accessToken, refreshToken };
}

// ── Schemas ──────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7).max(20).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(7).max(20).optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(d => d.email || d.phone, { message: 'Email or phone is required' });

const emailSchema = z.object({ email: z.string().email('Invalid email') });
const phoneSchema = z.object({ phone: z.string().min(7).max(20) });
const otpSendSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
}).refine(d => d.email || d.phone, { message: 'Email or phone is required' });

const otpVerifySchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
}).refine(d => d.email || d.phone, { message: 'Email or phone is required' });

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
  otp: z.string().length(6),
  password: z.string().min(6).max(128),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(128),
});

// ── POST /auth/register ──────────────────────────────────

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    // Separate queries to avoid Mongoose 9.x $or + select compatibility issues
    const exists = await User.findOne({ email: normalizedEmail }) || (phone ? await User.findOne({ phone }) : null);
    if (exists) {
      return error(res, 'Email or phone already registered', 400);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashed,
      role: 'customer',
      isVerified: false,
    });

    const { accessToken, refreshToken } = signTokens(user);

    await Session.create({ userId: user._id });
    user.isLoggedIn = true;
    user.token = accessToken;
    await user.save();

    if (process.env.SMTP_HOST) {
      const verifyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
      sendGenericEmail({ to: user.email, ...verifyEmailTemplate(name, verifyToken) }).catch(() => {});
      console.log(`Verification email sent to ${normalizedEmail}`);
    } else {
      user.isVerified = true;
      await user.save();
    }

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Registration successful. Please verify your email.', 201);
  } catch (err) {
    console.error('Register error:', err.message);
    error(res, err.message);
  }
});

// ── POST /auth/login ─────────────────────────────────────

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Build filter without $or to avoid Mongoose 9.x compatibility issues
    const filter = {};
    if (email) filter.email = email.toLowerCase();
    if (phone) filter.phone = phone;
    if (!Object.keys(filter).length) return error(res, 'Email or phone is required', 400);

    let user = await User.findOne(filter);
    if (user && require('../config/db').isUsingMongo()) {
      user = await User.findById(user._id).select('+password');
    }

    // Account lockout check
    if (user && user.lockUntil && new Date(user.lockUntil) > new Date()) {
      const remaining = Math.ceil((new Date(user.lockUntil) - new Date()) / 1000 / 60);
      return error(res, `Account locked. Try again in ${remaining} minutes`, 429);
    }

    const dummyHash = '$2a$10$' + 'x'.repeat(53);
    const isMatch = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, dummyHash);
    if (!user || !isMatch) {
      // Increment lockout counter
      if (user) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        if (user.loginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
          user.loginAttempts = 0;
        }
        await user.save();
      }
      return error(res, 'Invalid credentials', 401);
    }

    // Reset lockout on success
    user.loginAttempts = 0;
    user.lockUntil = null;

    if (!user.isVerified) {
      await user.save();
      return error(res, 'Please verify your email before logging in', 403);
    }

    await Session.deleteOne({ userId: user._id });
    await Session.create({ userId: user._id });

    const { accessToken, refreshToken } = signTokens(user);
    user.isLoggedIn = true;
    user.token = accessToken;
    await user.save();

    success(res, { accessToken, refreshToken, user: sanitize(user) }, `Welcome back ${user.name || 'User'}`);
  } catch (err) {
    console.error('Login error:', err.message);
    error(res, err.message);
  }
});

// ── POST /auth/me ────────────────────────────────────────

router.get('/me', auth, (req, res) => {
  success(res, req.user, 'User fetched');
});
router.post('/me', auth, (req, res) => {
  success(res, req.user, 'User fetched');
});

// ── POST /auth/logout ────────────────────────────────────

router.post('/logout', auth, async (req, res) => {
  try {
    await Session.deleteOne({ userId: req.user._id });
    req.user.isLoggedIn = false;
    req.user.token = null;
    await req.user.save();

    // Blacklist the current token
    if (req.token) {
      await Token.create({
        token: req.token,
        type: 'blacklist',
        userId: req.user._id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }).catch(() => {});
    }

    res.clearCookie('token', { path: '/' });
    res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });

    success(res, null, 'Logged out successfully');
  } catch (err) {
    console.error('Logout error:', err.message);
    error(res, err.message);
  }
});

// ── POST /auth/verify-email ──────────────────────────────

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return error(res, 'Token required', 400);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return error(res, 'User not found', 404);
    if (user.isVerified) return success(res, null, 'Email already verified');

    user.isVerified = true;
    await user.save();
    success(res, null, 'Email verified successfully');
  } catch (err) {
    if (err.name === 'TokenExpiredError') return error(res, 'Verification link expired', 400);
    error(res, err.message);
  }
});

router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return error(res, 'User not found', 404);

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?verified=true`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?verified=false`);
  }
});

// ── POST /auth/forgot-password ───────────────────────────

router.post('/forgot-password', validate(emailSchema), async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      const code = generateCode();
      const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      user.resetCode = hashCode(code);
      user.resetCodeExpiry = expiry;
      await user.save();

      if (process.env.SMTP_HOST) {
        sendGenericEmail({ to: user.email, ...passwordResetEmail(user.name, code) }).catch(() => {});
      } else {
        console.log(`Reset code sent for ${email}`);
      }
    }

    success(res, null, 'If the email exists, a reset code has been sent');
  } catch (err) {
    error(res, err.message);
  }
});

// ── POST /auth/reset-password ────────────────────────────

router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return error(res, 'Invalid request', 400);

    const query = await selectPassword(User.findById(user._id));
    const userWithPass = await query;
    if (userWithPass?.resetCode !== hashCode(otp)) return error(res, 'Invalid reset code', 400);
    if (new Date(user.resetCodeExpiry) < new Date()) return error(res, 'Reset code expired', 400);

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetCode = '';
    user.resetCodeExpiry = '';
    await user.save();

    await Token.deleteMany({ userId: user._id, type: 'refresh' });
    await Session.deleteMany({ userId: user._id });

    success(res, null, 'Password reset successful. Please login with your new password.');
  } catch (err) {
    error(res, err.message);
  }
});

// ── POST /auth/change-password ───────────────────────────

router.post('/change-password', auth, validate(changePasswordSchema), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const query = await selectPassword(User.findById(req.user._id));
    const user = await query;
    if (!user) return error(res, 'User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return error(res, 'Current password is incorrect', 400);

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    await Token.deleteMany({ userId: user._id, type: 'refresh' });
    await Session.deleteMany({ userId: user._id });

    success(res, null, 'Password changed successfully. Please login again.');
  } catch (err) {
    error(res, err.message);
  }
});

// ── POST /auth/supabase-login ────────────────────────────

router.post('/supabase-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password are required', 400);

    const { getAuthClient } = require('../config/supabase');
    const supabase = getAuthClient();
    if (!supabase) return error(res, 'Supabase not configured', 500);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });
    if (authError) return error(res, authError.message === 'Invalid login credentials' ? 'Invalid email or password' : authError.message, 401);
    if (!data?.user) return error(res, 'Authentication failed', 401);

    const user = await findOrCreateMongoUser(data.user);
    if (!user) return error(res, 'User sync failed', 500);

    const { accessToken, refreshToken } = signTokens(user);
    await Session.deleteOne({ userId: user._id });
    await Session.create({ userId: user._id });
    user.isLoggedIn = true;
    user.token = accessToken;
    await user.save();

    const tokenMaxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: tokenMaxAge, path: '/' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: tokenMaxAge, path: '/api/auth/refresh' });

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Login successful');
  } catch (err) {
    console.error('Supabase login error:', err.message);
    error(res, err.message);
  }
});

// ── POST /auth/supabase-register ─────────────────────────

router.post('/supabase-register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return error(res, 'Name, email and password are required', 400);

    const { getAdminClient } = require('../config/supabase');
    const supabase = getAdminClient();
    if (!supabase) return error(res, 'Supabase not configured', 500);

    const { data, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { name, phone },
    });
    if (authError) return error(res, authError.message, 400);

    const mongoUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      supabaseId: data.user.id,
      role: 'customer',
      isVerified: true,
    });

    const { accessToken, refreshToken } = signTokens(mongoUser);
    await Session.create({ userId: mongoUser._id });
    mongoUser.isLoggedIn = true;
    mongoUser.token = accessToken;
    await mongoUser.save();

    const tokenMaxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: tokenMaxAge, path: '/' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: tokenMaxAge, path: '/api/auth/refresh' });

    success(res, { accessToken, refreshToken, user: sanitize(mongoUser) }, 'Registration successful', 201);
  } catch (err) {
    console.error('Supabase register error:', err.message);
    error(res, err.message);
  }
});

// ── POST /auth/supabase-sync ─────────────────────────────

router.post('/supabase-sync', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return error(res, 'Access token required', 400);

    const supabaseUser = await verifySupabaseToken(accessToken);
    if (!supabaseUser) return error(res, 'Invalid Supabase token', 401);

    const user = await findOrCreateMongoUser(supabaseUser);
    if (!user) return error(res, 'User creation failed', 500);

    const tokenMaxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie('token', accessToken, {
      httpOnly: true, secure: true, sameSite: 'none',
      maxAge: tokenMaxAge, path: '/',
    });

    success(res, { user: sanitize(user) }, 'Session synced');
  } catch (err) {
    console.error('Supabase sync error:', err.message);
    error(res, err.message);
  }
});

// ── POST /auth/otp-session ────────────────────────────────

router.post('/otp-session', async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) return error(res, 'Email or phone is required', 400);

    const filter = {};
    if (email) filter.email = email.toLowerCase();
    if (phone) filter.phone = phone;
    let user = await User.findOne(filter);

    if (!user) {
      const name = email ? email.split('@')[0] : `User${phone.slice(-4)}`;
      user = await User.create({
        name,
        email: email?.toLowerCase() || null,
        phone: phone || null,
        isVerified: true,
        role: 'customer',
      });
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const { accessToken, refreshToken } = signTokens(user);
    await Session.deleteOne({ userId: user._id });
    await Session.create({ userId: user._id });
    user.isLoggedIn = true;
    user.token = accessToken;
    await user.save();

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Login successful');
  } catch (err) {
    console.error('OTP session error:', err.message);
    error(res, err.message);
  }
});

// ── POST /auth/refresh ───────────────────────────────────

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    if (!refreshToken) return error(res, 'Refresh token required', 400);

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch {
      return error(res, 'Invalid or expired refresh token', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) return error(res, 'User not found', 404);

    const tokens = signTokens(user);
    user.token = tokens.accessToken;
    await user.save();

    const tokenMaxAge = 7 * 24 * 60 * 60 * 1000;
    res.cookie('token', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: tokenMaxAge, path: '/' });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: tokenMaxAge, path: '/api/auth/refresh' });

    success(res, tokens, 'Token refreshed');
  } catch (err) {
    error(res, err.message);
  }
});

// ── POST /auth/send-otp ──────────────────────────────────

router.post('/send-otp', validate(otpSendSchema), async (req, res) => {
  try {
    const { email, phone } = req.body;
    const identifier = email?.toLowerCase() || phone;
    const otp = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const filter = {};
    if (email) filter.email = identifier;
    if (phone) filter.phone = identifier;

    const user = await User.findOne(filter);
    if (user) {
      user.otp = hashCode(otp);
      user.otpExpiry = expiresAt;
      await user.save();
    } else {
      await Token.create({
        token: hashCode(otp),
        type: 'otp',
        email: email?.toLowerCase() || null,
        phone: phone || null,
        expiresAt,
      });
    }

    if (email && process.env.SMTP_HOST) {
      sendGenericEmail({
        to: email,
        subject: 'Your OTP - PC Deals India',
        text: `Your OTP is ${otp}. It expires in 5 minutes. - PC Deals India`,
      }).catch(() => {});
    } else {
      console.log(`OTP for ${identifier}: ${otp}`);
    }

    success(res, null, 'OTP sent successfully');
  } catch (err) {
    error(res, err.message);
  }
});

// ── POST /auth/verify-otp ────────────────────────────────

router.post('/verify-otp', validate(otpVerifySchema), async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const hashedOtp = hashCode(otp);
    const filter = {};
    if (email) filter.email = email.toLowerCase();
    if (phone) filter.phone = phone;

    let user = await User.findOne(filter);
    let isOtpValid = false;

    if (user) {
      if (user.otp === hashedOtp && new Date(user.otpExpiry) > new Date()) {
        isOtpValid = true;
      }
      // Consume OTP on every attempt to prevent brute-force
      user.otp = '';
      user.otpExpiry = '';
      if (isOtpValid) user.isVerified = true;
      await user.save();
    } else {
      const otpRecord = await Token.findOne({ token: hashedOtp, type: 'otp', ...filter });
      if (otpRecord && new Date(otpRecord.expiresAt) > new Date()) {
        isOtpValid = true;
        await Token.findByIdAndDelete(otpRecord._id);
        user = await User.create({
          name: email ? email.split('@')[0] : `User${phone?.slice(-4)}`,
          email: email?.toLowerCase() || null,
          phone: phone || null,
          isVerified: true,
          role: 'customer',
        });
      } else if (otpRecord) {
        // Consume OTP on failed attempt
        await Token.findByIdAndDelete(otpRecord._id);
      }
    }

    if (!isOtpValid || !user) {
      return error(res, 'Invalid or expired OTP', 400);
    }

    const { accessToken, refreshToken } = signTokens(user);
    await Session.deleteOne({ userId: user._id });
    await Session.create({ userId: user._id });
    user.isLoggedIn = true;
    user.token = accessToken;
    await user.save();

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Login successful');
  } catch (err) {
    error(res, err.message);
  }
});

// ── Google OAuth ─────────────────────────────────────────

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.startsWith('your_')) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      const googleId = profile.id;
      let user = email ? await User.findOne({ email }) : null;
      if (user) {
        user.googleId = googleId;
        user.name = profile.displayName || user.name;
        await user.save();
      } else {
        user = await User.create({
          name: profile.displayName || email?.split('@')[0] || 'User',
          email,
          googleId,
          isVerified: true,
          role: 'customer',
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

router.get('/google', (req, res, next) => {
  if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.startsWith('your_')) {
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
  } else {
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_not_configured`);
  }
});

router.get('/google/callback', (req, res, next) => {
  if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.startsWith('your_')) {
    passport.authenticate('google', { session: false, failureRedirect: '/login' }, (err, user) => {
      if (err || !user) return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_auth_failed`);
      const { accessToken, refreshToken } = signTokens(user);
      Token.create({
        token: refreshToken,
        type: 'refresh',
        userId: user._id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}?token=${accessToken}`);
    })(req, res, next);
  } else {
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_not_configured`);
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return error(res, 'Google credential is required', 400);

    const axios = require('axios');
    const verifyRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const payload = verifyRes.data;

    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const name = payload.name || email?.split('@')[0] || 'User';

    let user = email ? await User.findOne({ email }) : null;
    if (user) {
      user.googleId = googleId;
      await user.save();
    } else {
      user = await User.create({ name, email, googleId, isVerified: true, role: 'customer' });
    }

    const { accessToken, refreshToken } = signTokens(user);
    await Token.create({
      token: refreshToken,
      type: 'refresh',
      userId: user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Google login successful');
  } catch (err) {
    error(res, 'Google authentication failed');
  }
});

module.exports = router;
