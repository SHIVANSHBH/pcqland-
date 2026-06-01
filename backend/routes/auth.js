const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const { auth, sanitize, generateRefreshToken, generateCode } = require('../middleware/auth');
const { success, error } = require('../utils/response');
const { sendGenericEmail } = require('../utils/email');
const { verificationEmail, passwordResetEmail } = require('../utils/templates');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return error(res, 'Name, email, phone, and password are required', 400);
    }
    if (password.length < 6) {
      return error(res, 'Password must be at least 6 characters', 400);
    }

    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (exists) {
      return error(res, 'Email or phone already registered', 400);
    }

    const hashed = await bcrypt.hash(password, 10);
    const verificationCode = generateCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashed,
      role: 'customer',
      isVerified: false,
      verificationCode,
      verificationCodeExpiry: codeExpiry.toISOString(),
    });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });
    const refreshToken = generateRefreshToken();
    await Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });

    if (process.env.SMTP_HOST && process.env.SMTP_HOST !== 'smtp.gmail.com') {
      sendGenericEmail({ to: user.email, ...verificationEmail(name, verificationCode) }).catch(() => {});
    } else {
      console.log(`Verification code for ${email}: ${verificationCode}`);
    }

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Registration successful. Please verify your email.', 201);
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return error(res, 'Email and code are required', 400);

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

router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, 'Email is required', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return error(res, 'User not found', 404);
    if (user.isVerified) return success(res, null, 'Email already verified');

    const verificationCode = generateCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await User.findByIdAndUpdate(user._id, { verificationCode, verificationCodeExpiry: codeExpiry.toISOString() });

    if (process.env.SMTP_HOST && process.env.SMTP_HOST !== 'smtp.gmail.com') {
      sendGenericEmail({ to: user.email, ...verificationEmail(user.name, verificationCode) }).catch(() => {});
    } else {
      console.log(`Verification code for ${email}: ${verificationCode}`);
    }

    success(res, null, 'Verification code resent');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return error(res, 'Email/phone and password are required', 400);
    }

    const user = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'Invalid credentials', 401);
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });
    const refreshToken = generateRefreshToken();
    await Token.create({ token: refreshToken, type: 'refresh', userId: user._id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });

    success(res, { accessToken, refreshToken, user: sanitize(user) }, 'Login successful');
  } catch (err) {
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

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, 'Email is required', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return success(res, null, 'If the email exists, a reset code has been sent');

    const resetCode = generateCode();
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await User.findByIdAndUpdate(user._id, { resetCode, resetCodeExpiry: codeExpiry.toISOString() });

    if (process.env.SMTP_HOST && process.env.SMTP_HOST !== 'smtp.gmail.com') {
      sendGenericEmail({ to: user.email, ...passwordResetEmail(user.name, resetCode) }).catch(() => {});
    } else {
      console.log(`Password reset code for ${email}: ${resetCode}`);
    }

    success(res, null, 'If the email exists, a reset code has been sent');
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, password } = req.body;
    if (!email || !code || !password) return error(res, 'Email, code, and new password are required', 400);
    if (password.length < 6) return error(res, 'Password must be at least 6 characters', 400);

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

router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return error(res, 'Current and new password are required', 400);
    if (newPassword.length < 6) return error(res, 'New password must be at least 6 characters', 400);

    const user = await User.findById(req.user._id);
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

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return error(res, 'Phone number is required', 400);

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

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return error(res, 'Phone and OTP are required', 400);

    let user = await User.findOne({ phone });
    if (user) {
      if (user.otp !== otp) return error(res, 'Invalid OTP', 400);
      if (new Date(user.otpExpiry) < new Date()) return error(res, 'OTP expired', 400);
      await User.findByIdAndUpdate(user._id, { isVerified: true, otp: '', otpExpiry: '' });
      success(res, null, 'OTP verified successfully');
    } else {
      const otpRecord = await Token.findOne({ token: otp, type: 'otp', phone });
      if (!otpRecord) return error(res, 'Invalid OTP', 400);
      if (new Date(otpRecord.expiresAt) < new Date()) return error(res, 'OTP expired', 400);
      await Token.findByIdAndDelete(otpRecord._id);
      success(res, null, 'OTP verified successfully');
    }
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

module.exports = router;
