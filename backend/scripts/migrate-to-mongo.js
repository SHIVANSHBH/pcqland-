/**
 * Migration script: NeDB -> MongoDB
 * Run: node scripts/migrate-to-mongo.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pcdeals';
const DATA_DIR = path.join(__dirname, '..', 'data');

const models = {
  User: require('../models-mongo/User'),
  Product: require('../models-mongo/Product'),
  Category: require('../models-mongo/Category'),
  Order: require('../models-mongo/Order'),
  Inventory: require('../models-mongo/Inventory'),
  Token: require('../models-mongo/Token'),
  Setting: require('../models-mongo/Setting'),
};

async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  for (const [name, Model] of Object.entries(models)) {
    const dbFile = path.join(DATA_DIR, `${name}.db`);
    if (!fs.existsSync(dbFile)) {
      console.log(`Skipping ${name}: no file found`);
      continue;
    }

    const raw = fs.readFileSync(dbFile, 'utf-8').trim();
    if (!raw) { console.log(`Skipping ${name}: empty file`); continue; }

    const docs = raw.split('\n').filter(Boolean).map(line => {
      const doc = JSON.parse(line);
      delete doc._id;
      if (doc.createdAt) doc.createdAt = new Date(doc.createdAt);
      if (doc.updatedAt) doc.updatedAt = new Date(doc.updatedAt);
      if (doc.usedAt) doc.usedAt = doc.usedAt ? new Date(doc.usedAt) : null;
      if (doc.verificationCodeExpiry) doc.verificationCodeExpiry = new Date(doc.verificationCodeExpiry);
      if (doc.resetCodeExpiry) doc.resetCodeExpiry = new Date(doc.resetCodeExpiry);
      if (doc.otpExpiry) doc.otpExpiry = new Date(doc.otpExpiry);
      if (doc.expiresAt) doc.expiresAt = new Date(doc.expiresAt);
      return doc;
    });

    if (docs.length > 0) {
      await Model.deleteMany({});
      await Model.insertMany(docs);
      console.log(`Migrated ${docs.length} ${name} documents`);
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
