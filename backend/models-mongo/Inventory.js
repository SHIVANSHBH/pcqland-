const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  key: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  usedAt: { type: Date, default: null },
}, { timestamps: true });

inventorySchema.index({ product: 1, isUsed: 1 });
inventorySchema.index({ key: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
