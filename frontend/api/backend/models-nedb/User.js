const { createModel } = require('../config/dev-store');

const User = createModel('User', {
  allowedFields: ['name', 'email', 'phone', 'password', 'role', 'isVerified', 'verificationCode', 'verificationCodeExpiry', 'resetCode', 'resetCodeExpiry', 'otp', 'otpExpiry', 'walletBalance', 'totalCashbackEarned', 'address', 'gstin', 'supabaseId'],
  required: ['name', 'email', 'password'],
  defaults: { role: 'customer', isVerified: false, walletBalance: 0, totalCashbackEarned: 0 },
});

module.exports = User;
