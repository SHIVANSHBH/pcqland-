const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  keys: [String],
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  orderId: { type: String, required: true, unique: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  amount: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  cashbackUsed: { type: Number, default: 0 },
  prepaidDiscount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  cashbackEarned: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['razorpay', 'wallet'], default: 'razorpay' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    gstin: String,
    address: String,
  },
  deliveryEmail: String,
  deliveryPhone: String,
  invoiceUrl: String,
}, { timestamps: true });

orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model('Order', orderSchema);
