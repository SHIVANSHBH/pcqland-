require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const connectDB = require('./config/db');
const { getStore } = require('./config/dev-store');

function generateKey(prefix) {
  const segments = [];
  for (let i = 0; i < 5; i++) {
    segments.push(crypto.randomBytes(3).toString('hex').toUpperCase());
  }
  return segments.join('-');
}

async function seedKeys() {
  await connectDB();

  const Inventory = getStore('Inventory');
  await Inventory.remove({}, { multi: true });

  const Product = getStore('Product');
  const products = await Product.find({});

  let totalKeys = 0;
  for (const product of products) {
    const qty = product.slug.includes('combo') ? 5 : product.slug.includes('server') || product.slug.includes('enterprise') ? 3 : 10;
    for (let i = 0; i < qty; i++) {
      const prefix = product.slug.substring(0, 3).toUpperCase();
      await Inventory.insert({
        product: product._id,
        productName: product.name,
        key: generateKey(prefix),
        isUsed: false,
        order: null,
        usedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      totalKeys++;
    }
  }

  console.log(`Seeded ${totalKeys} keys for ${products.length} products`);
  process.exit(0);
}

seedKeys();
