const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  type: { type: String, enum: ['refresh', 'blacklist', 'otp'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phone: { type: String },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

tokenSchema.index({ token: 1, type: 1 });
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Token', tokenSchema);
