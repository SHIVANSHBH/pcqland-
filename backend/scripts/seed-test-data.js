/**
 * Seed test data with fake products & inventory keys.
 * Run: node scripts/seed-test-data.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

const SEED_PASSWORD = 'Test@123';

const categories = [
  { name: 'Windows Keys', slug: 'windows-keys', description: 'Genuine Microsoft Windows License Keys', displayOrder: 1 },
  { name: 'Microsoft Office Keys', slug: 'microsoft-office-keys', description: 'Microsoft Office License Keys', displayOrder: 2 },
  { name: 'Antivirus Keys', slug: 'antivirus-keys', description: 'Antivirus & Internet Security Keys', displayOrder: 3 },
];

const products = [
  { name: 'Windows 11 Pro', slug: 'windows-11-pro', catSlug: 'windows-keys', price: 1499, mrp: 12999, desc: 'Genuine Microsoft Windows 11 Pro License Key – Lifetime validity', keysCount: 5 },
  { name: 'Windows 10 Pro', slug: 'windows-10-pro', catSlug: 'windows-keys', price: 1299, mrp: 10999, desc: 'Genuine Microsoft Windows 10 Pro License Key – Lifetime validity', keysCount: 5 },
  { name: 'Office 2021 Pro Plus', slug: 'office-2021-pro-plus', catSlug: 'microsoft-office-keys', price: 2499, mrp: 28999, desc: 'Microsoft Office 2021 Professional Plus – Lifetime', keysCount: 3 },
  { name: 'Office 2019 Pro Plus', slug: 'office-2019-pro-plus', catSlug: 'microsoft-office-keys', price: 1999, mrp: 24999, desc: 'Microsoft Office 2019 Professional Plus – Lifetime', keysCount: 3 },
  { name: 'Kaspersky Internet Security 1Y', slug: 'kaspersky-internet-security-1y', catSlug: 'antivirus-keys', price: 599, mrp: 1999, desc: 'Kaspersky Internet Security – 1 Year / 1 PC', keysCount: 3 },
  { name: 'Quick Heal Total Security 1Y', slug: 'quick-heal-total-security-1y', catSlug: 'antivirus-keys', price: 399, mrp: 1499, desc: 'Quick Heal Total Security – 1 Year / 1 PC', keysCount: 3 },
];

function generateFakeKey(productSlug) {
  const prefix = productSlug.split('-').map(w => w[0]).join('').toUpperCase().slice(0, 4);
  const seg = () => crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${seg()}-${seg()}-${seg()}`;
}

async function seed() {
  try {
    // Clean existing test data
    await Promise.all([
      User.deleteMany({ email: /test/ }),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Inventory.deleteMany({}),
    ]);
    console.log('Cleaned existing test data');

    // Create admin user
    const adminPassword = await bcrypt.hash(SEED_PASSWORD, 10);
    const admin = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      phone: '9999999999',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
    });
    console.log(`✅ Admin user: admin@test.com / ${SEED_PASSWORD}`);

    // Create customer user
    const customer = await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '8888888888',
      password: adminPassword,
      role: 'customer',
      isVerified: true,
    });
    console.log(`✅ Customer user: customer@test.com / ${SEED_PASSWORD}`);

    // Create categories
    const catMap = {};
    for (const cat of categories) {
      const created = await Category.create(cat);
      catMap[cat.slug] = created._id;
    }
    console.log(`✅ ${categories.length} categories created`);

    // Create products with inventory
    for (const prod of products) {
      const product = await Product.create({
        name: prod.name,
        slug: prod.slug,
        description: prod.desc,
        shortDescription: prod.desc,
        category: catMap[prod.catSlug],
        price: prod.price,
        mrp: prod.mrp,
        validity: 'Lifetime',
        isActive: true,
        isFeatured: true,
      });

      const keys = [];
      for (let i = 0; i < prod.keysCount; i++) {
        keys.push({
          product: product._id,
          productName: prod.name,
          key: generateFakeKey(prod.slug),
          isUsed: false,
        });
      }
      await Inventory.insertMany(keys);
      console.log(`✅ ${prod.name} — ₹${prod.price} — ${prod.keysCount} keys added`);
    }

    console.log('\n🎉 Seed complete! Login with:');
    console.log('   Admin:    admin@test.com / Test@123');
    console.log('   Customer: customer@test.com / Test@123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
