const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, minlength: 6, select: false },
  googleId: { type: String },
  supabaseId: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  totalCashbackEarned: { type: Number, default: 0 },
  address: { type: String, default: '' },
  gstin: { type: String, default: '' },
  verificationCode: { type: String },
  verificationCodeExpiry: { type: Date },
  resetCode: { type: String },
  resetCodeExpiry: { type: Date },
  otp: { type: String },
  otpExpiry: { type: Date },
  emailOtp: { type: String },
  emailOtpExpiry: { type: Date },
  token: { type: String, default: null },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.sanitize = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
