const { createModel } = require('../config/dev-store');

const Order = createModel('Order', {
  allowedFields: ['user', 'items', 'orderId', 'razorpayOrderId', 'razorpayPaymentId', 'amount', 'subtotal', 'cashbackUsed', 'prepaidDiscount', 'tax', 'cashbackEarned', 'paymentMethod', 'paymentStatus', 'orderStatus', 'customerInfo', 'deliveryEmail', 'deliveryPhone', 'invoiceUrl'],
  required: ['user', 'items', 'orderId', 'amount'],
  defaults: { paymentStatus: 'pending', orderStatus: 'pending' },
});

module.exports = Order;
