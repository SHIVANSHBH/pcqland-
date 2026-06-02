require('dotenv').config();
const path = require('path');
const fs = require('fs');

(async () => {
  const { isUsingMongo } = require('./config/db');
  await require('./config/db')();

  const User = require('./models/User');
  const Product = require('./models/Product');
  const Category = require('./models/Category');
  const Inventory = require('./models/Inventory');
  const Setting = require('./models/Setting');

  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@pcdealsindia.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@pcdealsindia.com',
      phone: '919999999999',
      password: 'Admin@123',
      role: 'admin',
      isVerified: true,
    });
    console.log('✅ Admin created: admin@pcdealsindia.com / Admin@123');
  }

  // Create categories
  const catData = [
    { name: 'Windows Keys', slug: 'windows-keys' },
    { name: 'Microsoft Office Keys', slug: 'microsoft-office-keys' },
    { name: 'Antivirus Keys', slug: 'antivirus-keys' },
    { name: 'Special Combo Offer', slug: 'special-combo-offer' },
  ];
  for (const c of catData) {
    const exists = await Category.findOne({ slug: c.slug });
    if (!exists) await Category.create(c);
  }
  console.log('✅ Categories seeded');

  // Create products
  const productData = [
    { name: 'Windows 11 Pro', slug: 'windows-11-pro', category: 'windows-keys', price: 1499, mrp: 3499, description: 'Genuine Windows 11 Professional License Key' },
    { name: 'Windows 10 Pro', slug: 'windows-10-pro', category: 'windows-keys', price: 999, mrp: 2999, description: 'Genuine Windows 10 Professional License Key' },
    { name: 'Microsoft Office 2021 Pro', slug: 'microsoft-office-2021-pro', category: 'microsoft-office-keys', price: 2499, mrp: 5999, description: 'Microsoft Office 2021 Professional Plus License Key' },
    { name: 'Microsoft Office 2019 Pro', slug: 'microsoft-office-2019-pro', category: 'microsoft-office-keys', price: 1999, mrp: 4999, description: 'Microsoft Office 2019 Professional Plus License Key' },
    { name: 'Quick Heal Total Security', slug: 'quick-heal-total-security', category: 'antivirus-keys', price: 599, mrp: 1499, description: 'Quick Heal Total Security 1 Year License' },
    { name: 'Kaspersky Internet Security', slug: 'kaspersky-internet-security', category: 'antivirus-keys', price: 799, mrp: 1999, description: 'Kaspersky Internet Security 1 Year License' },
    { name: 'Windows 11 + Office 2021 Combo', slug: 'windows-11-office-2021-combo', category: 'special-combo-offer', price: 3499, mrp: 9498, description: 'Windows 11 Pro + Office 2021 Professional Plus Bundle' },
    { name: 'Windows 10 + Office 2019 Combo', slug: 'windows-10-office-2019-combo', category: 'special-combo-offer', price: 2499, mrp: 7998, description: 'Windows 10 Pro + Office 2019 Professional Plus Bundle' },
  ];
  for (const p of productData) {
    const exists = await Product.findOne({ slug: p.slug });
    if (!exists) await Product.create(p);
  }
  console.log('✅ Products seeded');

  // Seed demo inventory keys
  const products = await Product.find({});
  for (const product of products) {
    const keyCount = await Inventory.countDocuments({ product: product._id });
    if (keyCount === 0) {
      const keys = [];
      for (let i = 0; i < 5; i++) {
        const key = 'DEMO-' + product.slug.toUpperCase().replace(/[^A-Z0-9]/g, '') +
          '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        keys.push({ product: product._id, productName: product.name, key, isUsed: false });
      }
      if (isUsingMongo()) {
        await Inventory.insertMany(keys);
      } else {
        for (const k of keys) await Inventory.create(k);
      }
    }
  }
  console.log('✅ Demo keys seeded (5 per product)');

  // Set default settings
  const settings = [
    { key: 'shopName', value: 'PC Deals India' },
    { key: 'shopEmail', value: 'support@pcdealsindia.com' },
    { key: 'shopPhone', value: '+91 97286-22667' },
  ];
  for (const s of settings) {
    const exists = await Setting.findOne({ key: s.key });
    if (!exists) await Setting.create(s);
  }
  console.log('✅ Settings seeded');

  console.log('\n🎉 Demo data seeded successfully!');
  console.log('   Admin login: admin@pcdealsindia.com / Admin@123');
  process.exit(0);
})().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});