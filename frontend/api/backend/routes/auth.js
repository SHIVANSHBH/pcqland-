const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const { auth, sanitize, generateRefreshToken, generateCode } = require('../middleware/auth');
const { validate, z } = require('../middleware/validate');
const { success, error } = require('../utils/response');
const { sendGenericEmail } = require('../utils/email');
const { verificationEmail, passwordResetEmail } = require('../utils/templates');

const router = express.Router();

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
const codeSchema = z.object({ email: z.string().email('Invalid email'), code: z.string().length(6, 'Code must be 6 digits') });
const resetPasswordSchema = z.object({ email: z.string().email('Invalid email'), code: z.string().length(6), password: z.string().min(6).max(128) });
const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(6).max(128) });
const phoneSchema = z.object({ phone: z.string().min(7).max(20) });
const otpSchema = z.object({ phone: z.string().min(7).max(20), otp: z.string().length(6) });

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (exists) {
      return error(res, 'Email or phone already registered', 400);
    }

    const hashed = require('../config/db').isUsingMongo() ? password : await bcrypt.hash(password, 10);
    const verificationCode = generateCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashed,
      role: 'customer',
      isVerified: process.env.SMTP_HOST ? false : true,
      verificationCode,
      verificationCodeExpiry: codeExpiry.toISOString(),
    });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' });
    const refreshToken = generateRefreshToken();
    await Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });

    if (process.env.SMTP_HOST) {
      sendGenericEmail({ to: user.email, ...verificationEmail(name, verificationCode) }).catch(() => {});
    } else {
      console.log(`Verification code for ${email}: ${verificationCode}`);
    }

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
    };
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh-token',
    });

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Registration successful. Please verify your email.', 201);
  } catch (err) {
    console.error('Register error:', err.message, err.stack);
    error(res, err.message);
  }
});

router.post('/verify-email', validate(codeSchema), async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return error(res, 'User not found', 404);
    if (user.isVerified) return success(res, null, 'Email already verified');
    if (user.verificationCode !== code) return error(res, 'Invalid verification code', 400);
    if (new Date(user.verificationCodeExpiry) < new Date()) return error(res, 'Verification code expired', 400);

    await User.findByIdAndUpdate(user._id, { isVerified: true, verificationCode: '', verificationCodeExpiry: '' });
    success(res, null, 'Email verified successfully');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/resend-verification', validate(emailSchema), async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return error(res, 'User not found', 404);
    if (user.isVerified) return success(res, null, 'Email already verified');

    const verificationCode = generateCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await User.findByIdAndUpdate(user._id, { verificationCode, verificationCodeExpiry: codeExpiry.toISOString() });

    if (process.env.SMTP_HOST) {
      sendGenericEmail({ to: user.email, ...verificationEmail(user.name, verificationCode) }).catch(() => {});
    } else {
      console.log(`Verification code for ${email}: ${verificationCode}`);
    }

    success(res, null, 'Verification code resent');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    let userQuery = User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });
    if (require('../config/db').isUsingMongo()) {
      userQuery = userQuery.select('+password');
    }
    const user = await userQuery;

    const dummyHash = '$2a$10$' + 'x'.repeat(53);
    const isMatch = user ? await bcrypt.compare(password, user.password) : await bcrypt.compare(password, dummyHash);
    if (!user || !isMatch) {
      return error(res, 'Invalid credentials', 401);
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' });
    const refreshToken = generateRefreshToken();
    await Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
    };
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh-token',
    });

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Login successful');
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    error(res, err.message);
  }
});

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token is required', 400);

    const stored = await Token.findOne({ token: refreshToken, type: 'refresh' });
    if (!stored) return error(res, 'Invalid refresh token', 401);
    if (new Date(stored.expiresAt) < new Date()) {
      await Token.findByIdAndDelete(stored._id);
      return error(res, 'Refresh token expired, please login again', 401);
    }

    const user = await User.findById(stored.userId);
    if (!user) return error(res, 'User not found', 404);

    await Token.findByIdAndDelete(stored._id);

    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });
    const newRefreshToken = generateRefreshToken();
    await Token.create({ token: newRefreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });

    success(res, { accessToken: newAccessToken, refreshToken: newRefreshToken }, 'Token refreshed');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    await Token.create({ token: req.token, type: 'blacklist', userId: req.user._id, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() });

    const { refreshToken } = req.body;
    if (refreshToken) {
      const stored = await Token.findOne({ token: refreshToken, type: 'refresh' });
      if (stored) await Token.findByIdAndDelete(stored._id);
    }

    success(res, null, 'Logged out successfully');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/forgot-password', validate(emailSchema), async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const resetCode = generateCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      await User.findByIdAndUpdate(user._id, { resetCode, resetCodeExpiry: codeExpiry.toISOString() });
      if (process.env.SMTP_HOST) {
        sendGenericEmail({ to: user.email, ...passwordResetEmail(user.name, resetCode) }).catch(() => {});
      } else {
        console.log(`Password reset code for ${email}: ${resetCode}`);
      }
    }

    success(res, null, 'If the email exists, a reset code has been sent');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  try {
    const { email, code, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return error(res, 'Invalid request', 400);
    if (user.resetCode !== code) return error(res, 'Invalid reset code', 400);
    if (new Date(user.resetCodeExpiry) < new Date()) return error(res, 'Reset code expired', 400);

    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hashed, resetCode: '', resetCodeExpiry: '' });

    await Token.deleteMany({ userId: user._id, type: 'refresh' });

    success(res, null, 'Password reset successful. Please login with your new password.');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/change-password', auth, validate(changePasswordSchema), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const { isUsingMongo } = require('../config/db');
    const q = User.findById(req.user._id);
    if (isUsingMongo()) q.select('+password');
    const user = await q;
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return error(res, 'Current password is incorrect', 400);

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashed });

    await Token.deleteMany({ userId: user._id, type: 'refresh' });

    success(res, null, 'Password changed successfully. Please login again.');
  } catch (err) {
    error(res, err.message);
  }
});

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
        await User.findByIdAndUpdate(user._id, { googleId, name: profile.displayName || user.name });
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
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' });
      const refreshToken = generateRefreshToken();
      Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });
      const cookieOptions = { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' };
      res.cookie('token', accessToken, cookieOptions);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}?google_login=success`);
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
      await User.findByIdAndUpdate(user._id, { googleId });
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true,
        role: 'customer',
      });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' });
    const refreshToken = generateRefreshToken();
    await Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
    };
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh-token',
    });

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Google login successful');
  } catch (err) {
    error(res, 'Google authentication failed: ' + err.message);
  }
});

router.post('/send-email-otp', validate(emailSchema), async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const otp = generateCode();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      await User.findByIdAndUpdate(user._id, { emailOtp: otp, emailOtpExpiry: otpExpiry.toISOString() });
    } else {
      await Token.create({ token: otp, type: 'email-otp', email: normalizedEmail, expiresAt: otpExpiry.toISOString() });
    }

    if (process.env.SMTP_HOST) {
      sendGenericEmail({ to: email, subject: 'Your OTP for PC Deals India', text: `Your OTP is ${otp}. It expires in 5 minutes. - PC Deals India` }).catch(() => {});
    } else {
      console.log(`Email OTP for ${email}: ${otp}`);
    }

    success(res, null, 'OTP sent to your email');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/verify-email-otp', validate(z.object({ email: z.string().email(), otp: z.string().length(6) })), async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      if (user.emailOtp !== otp) return error(res, 'Invalid OTP', 400);
      if (new Date(user.emailOtpExpiry) < new Date()) return error(res, 'OTP expired', 400);
      await User.findByIdAndUpdate(user._id, { isVerified: true, emailOtp: '', emailOtpExpiry: '' });
    } else {
      const otpRecord = await Token.findOne({ token: otp, type: 'email-otp', email: normalizedEmail });
      if (!otpRecord) return error(res, 'Invalid OTP', 400);
      if (new Date(otpRecord.expiresAt) < new Date()) return error(res, 'OTP expired', 400);
      await Token.findByIdAndDelete(otpRecord._id);
      user = await User.create({
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        isVerified: true,
        role: 'customer',
      });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' });
    const refreshToken = generateRefreshToken();
    await Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
    };
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh-token',
    });

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Login successful');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/send-otp', validate(phoneSchema), async (req, res) => {
  try {
    const { phone } = req.body;

    const otp = generateCode();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ phone });
    if (user) {
      await User.findByIdAndUpdate(user._id, { otp, otpExpiry: otpExpiry.toISOString() });
    } else {
      await Token.create({ token: otp, type: 'otp', phone, expiresAt: otpExpiry.toISOString() });
    }

    if (process.env.WHATSAPP_API_KEY && process.env.WHATSAPP_API_KEY !== 'your_gupshup_api_key') {
      const axios = require('axios');
      axios.post(process.env.WHATSAPP_API_URL + '/msg', {
        channel: 'whatsapp',
        source: process.env.WHATSAPP_PHONE_NUMBER,
        destination: phone,
        message: `Your OTP is ${otp}. It expires in 5 minutes. - PC Deals India`,
        'src.name': 'PCDealsIndia',
      }, {
        headers: { 'api-key': process.env.WHATSAPP_API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
      }).catch(() => {});
    } else {
      console.log(`OTP for ${phone}: ${otp}`);
    }

    success(res, null, 'OTP sent successfully');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/verify-otp', validate(otpSchema), async (req, res) => {
  try {
    const { phone, otp } = req.body;

    let user = await User.findOne({ phone });
    if (user) {
      if (user.otp !== otp) return error(res, 'Invalid OTP', 400);
      if (new Date(user.otpExpiry) < new Date()) return error(res, 'OTP expired', 400);
      await User.findByIdAndUpdate(user._id, { isVerified: true, otp: '', otpExpiry: '' });
    } else {
      const otpRecord = await Token.findOne({ token: otp, type: 'otp', phone });
      if (!otpRecord) return error(res, 'Invalid OTP', 400);
      if (new Date(otpRecord.expiresAt) < new Date()) return error(res, 'OTP expired', 400);
      await Token.findByIdAndDelete(otpRecord._id);
      user = await User.create({
        name: 'User',
        phone,
        isVerified: true,
        role: 'customer',
      });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '7d' });
    const refreshToken = generateRefreshToken();
    await Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
    };
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh-token',
    });

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Login successful');
  } catch (err) {
    error(res, err.message);
  }
});

router.get('/me', auth, async (req, res) => {
  success(res, req.user, 'Profile fetched');
});

router.put('/profile', auth, async (req, res) => {
  try {
    const allowed = ['name', 'address', 'gstin'];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    success(res, sanitize(user), 'Profile updated');
  } catch (err) {
    error(res, err.message);
  }
});

router.get('/ping', (req, res) => {
  res.json({ pong: true });
});

router.get('/csrf', (req, res) => {
  const token = req.cookies.csrf_token || crypto.randomBytes(32).toString('hex');
  if (!req.cookies.csrf_token) {
    res.cookie('csrf_token', token, {
      httpOnly: false, secure: true,
      sameSite: 'none', path: '/',
    });
  }
  res.json({ csrfToken: token });
});

router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, 'Email is required', 400);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return error(res, 'User not found', 404);
    await User.findByIdAndUpdate(user._id, { $set: { role: 'admin' } });
    success(res, { email }, 'User promoted to admin');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/seed-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      return success(res, { email: existing.email }, 'Admin already exists');
    }
    const hashed = require('../config/db').isUsingMongo() ? 'Admin@123' : await bcrypt.hash('Admin@123', 10);
    const user = await User.create({
      name: 'Admin',
      email: 'admin@pcdeals.com',
      phone: '9999999999',
      password: hashed,
      role: 'admin',
      isVerified: true,
    });
    success(res, { email: user.email }, 'Admin created. Email: admin@pcdeals.com, Password: Admin@123');
  } catch (err) {
    error(res, err.message);
  }
});

module.exports = router;
