const Razorpay = require('razorpay');

let _razorpay = null;
function getRazorpay() {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_OAUTH_TOKEN) {
      throw new Error('Missing RAZORPAY_KEY_ID env var');
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

const createOrder = async (amount, receipt) => {
  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt,
  };
  return getRazorpay().orders.create(options);
};

const verifyPayment = (orderId, paymentId, signature) => {
  const crypto = require('crypto');
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};

module.exports = { createOrder, verifyPayment, getRazorpay };
