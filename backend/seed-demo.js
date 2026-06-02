require('dotenv').config();

(async () => {
  const { isUsingMongo } = require('./config/db');
  await require('./config/db')();

  const User = require('./models/User');
  const Product = require('./models/Product');
  const Category = require('./models/Category');
  const Inventory = require('./models/Inventory');
  const Setting = require('./models/Setting');

  const cats = [
    { name: 'Super Saver Combo', slug: 'special-combo-offer' },
    { name: 'Windows', slug: 'windows-keys' },
    { name: 'Office', slug: 'microsoft-office-keys' },
    { name: 'MS Projects', slug: 'projects' },
    { name: 'Windows Server', slug: 'windows-server' },
    { name: 'MS Visio', slug: 'microsoft-visio' },
    { name: 'MS Visual Studio', slug: 'ms-visual-studio' },
    { name: 'NET PROTECTOR', slug: 'net-protector-keys' },
    { name: 'QUICK HEAL', slug: 'quick-heal' },
    { name: 'Anti Fraud', slug: 'anti-fraud' },
    { name: 'K7 KEYS', slug: 'k7-keys' },
    { name: 'GUARDIAN', slug: 'guardian-keys' },
    { name: 'KASPERSKY', slug: 'kaspersky-keys' },
    { name: 'ESET', slug: 'eset-keys' },
    { name: 'Mcafee', slug: 'mcafee' },
  ];

  const prods = [
    { name: 'Windows 11 Pro', slug: 'windows-11-pro', cat: 'windows-keys', price: 1499, mrp: 12999, desc: 'Genuine Microsoft Windows 11 Pro License Key', validity: 'Lifetime' },
    { name: 'Windows 11 Home', slug: 'windows-11-home', cat: 'windows-keys', price: 999, mrp: 8999, desc: 'Genuine Microsoft Windows 11 Home License Key', validity: 'Lifetime' },
    { name: 'Windows 10 Pro', slug: 'windows-10-pro', cat: 'windows-keys', price: 1299, mrp: 10999, desc: 'Genuine Microsoft Windows 10 Pro License Key', validity: 'Lifetime' },
    { name: 'Windows 10 Home', slug: 'windows-10-home', cat: 'windows-keys', price: 899, mrp: 7999, desc: 'Genuine Microsoft Windows 10 Home License Key', validity: 'Lifetime' },
    { name: 'Microsoft Office 2021 Pro Plus', slug: 'office-2021-pro-plus', cat: 'microsoft-office-keys', price: 2499, mrp: 28999, desc: 'Microsoft Office 2021 Professional Plus License Key', validity: 'Lifetime' },
    { name: 'Microsoft Office 2019 Pro Plus', slug: 'office-2019-pro-plus', cat: 'microsoft-office-keys', price: 1999, mrp: 24999, desc: 'Microsoft Office 2019 Professional Plus License Key', validity: 'Lifetime' },
    { name: 'Microsoft Office 2021 Home Student', slug: 'office-2021-home-student', cat: 'microsoft-office-keys', price: 1499, mrp: 12999, desc: 'Microsoft Office 2021 Home & Student License Key', validity: 'Lifetime' },
    { name: 'Win 11 Pro + Office 2021 Pro Plus Combo', slug: 'win11-office2021-combo', cat: 'special-combo-offer', price: 3499, mrp: 41998, desc: 'Save big with this combo deal', validity: 'Lifetime' },
    { name: 'Win 10 Pro + Office 2019 Pro Plus Combo', slug: 'win10-office2019-combo', cat: 'special-combo-offer', price: 2999, mrp: 35998, desc: 'Best value combo for businesses', validity: 'Lifetime' },
    { name: 'Win 11 Pro + Office 2021 + Kaspersky Combo', slug: 'win11-office-kaspersky-combo', cat: 'special-combo-offer', price: 3999, mrp: 45997, desc: 'Ultimate combo with antivirus', validity: 'Lifetime' },
    { name: 'Kaspersky Internet Security 1Y-1PC', slug: 'kaspersky-internet-security-1y', cat: 'kaspersky-keys', price: 599, mrp: 1999, desc: 'Kaspersky Internet Security - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Kaspersky Total Security 1Y-3PC', slug: 'kaspersky-total-security-1y', cat: 'kaspersky-keys', price: 999, mrp: 2999, desc: 'Kaspersky Total Security - 1 Year / 3 PC', validity: '1 Year' },
    { name: 'Kaspersky Total Security 1Y-5PC', slug: 'kaspersky-total-security-5pc', cat: 'kaspersky-keys', price: 1499, mrp: 4999, desc: 'Kaspersky Total Security - 1 Year / 5 PC', validity: '1 Year' },
    { name: 'Kaspersky Antivirus 1Y-1PC', slug: 'kaspersky-antivirus-1y', cat: 'kaspersky-keys', price: 399, mrp: 1499, desc: 'Kaspersky Antivirus - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Quick Heal Total Security 1Y-1PC', slug: 'quick-heal-total-security-1y', cat: 'quick-heal', price: 399, mrp: 1499, desc: 'Quick Heal Total Security - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Quick Heal Internet Security 1Y-1PC', slug: 'quick-heal-internet-security-1y', cat: 'quick-heal', price: 299, mrp: 999, desc: 'Quick Heal Internet Security - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Quick Heal Total Security 1Y-3PC', slug: 'quick-heal-total-security-3pc', cat: 'quick-heal', price: 699, mrp: 2499, desc: 'Quick Heal Total Security - 1 Year / 3 PC', validity: '1 Year' },
    { name: 'Quick Heal Antivirus Pro 1Y-1PC', slug: 'quick-heal-antivirus-pro-1y', cat: 'quick-heal', price: 249, mrp: 799, desc: 'Quick Heal Antivirus Pro - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'ESET NOD32 Antivirus 1Y-1PC', slug: 'eset-nod32-1y', cat: 'eset-keys', price: 499, mrp: 1999, desc: 'ESET NOD32 Antivirus - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'ESET Internet Security 1Y-1PC', slug: 'eset-internet-security-1y', cat: 'eset-keys', price: 799, mrp: 2999, desc: 'ESET Internet Security - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'ESET Smart Security Premium 1Y-1PC', slug: 'eset-smart-security-1y', cat: 'eset-keys', price: 1199, mrp: 3999, desc: 'ESET Smart Security Premium - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'McAfee Total Protection 1Y-1PC', slug: 'mcafee-total-protection-1y', cat: 'mcafee', price: 599, mrp: 2499, desc: 'McAfee Total Protection - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'McAfee Total Protection 1Y-5PC', slug: 'mcafee-total-protection-5pc', cat: 'mcafee', price: 999, mrp: 3999, desc: 'McAfee Total Protection - 1 Year / 5 PC', validity: '1 Year' },
    { name: 'McAfee Internet Security 1Y-1PC', slug: 'mcafee-internet-security-1y', cat: 'mcafee', price: 449, mrp: 1799, desc: 'McAfee Internet Security - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'K7 Total Security 1Y-1PC', slug: 'k7-total-security-1y', cat: 'k7-keys', price: 349, mrp: 1299, desc: 'K7 Total Security - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'K7 Internet Security 1Y-1PC', slug: 'k7-internet-security-1y', cat: 'k7-keys', price: 249, mrp: 999, desc: 'K7 Internet Security - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'K7 Antivirus Pro 1Y-1PC', slug: 'k7-antivirus-pro-1y', cat: 'k7-keys', price: 199, mrp: 699, desc: 'K7 Antivirus Pro - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Net Protector Antivirus 1Y-1PC', slug: 'net-protector-1y', cat: 'net-protector-keys', price: 299, mrp: 999, desc: 'Net Protector Antivirus - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Net Protector Total Security 1Y-1PC', slug: 'net-protector-total-security-1y', cat: 'net-protector-keys', price: 499, mrp: 1499, desc: 'Net Protector Total Security - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Guardian Antivirus 1Y-1PC', slug: 'guardian-antivirus-1y', cat: 'guardian-keys', price: 249, mrp: 899, desc: 'Guardian Antivirus - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Guardian Total Security 1Y-1PC', slug: 'guardian-total-security-1y', cat: 'guardian-keys', price: 399, mrp: 1499, desc: 'Guardian Total Security - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Anti Fraud Standard 1Y-1PC', slug: 'anti-fraud-standard-1y', cat: 'anti-fraud', price: 349, mrp: 1299, desc: 'Anti Fraud Standard Protection - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Anti Fraud Premium 1Y-1PC', slug: 'anti-fraud-premium-1y', cat: 'anti-fraud', price: 599, mrp: 1999, desc: 'Anti Fraud Premium Protection - 1 Year / 1 PC', validity: '1 Year' },
    { name: 'Microsoft Project Professional 2021', slug: 'ms-project-2021-pro', cat: 'projects', price: 4999, mrp: 39999, desc: 'Microsoft Project Professional 2021 License Key', validity: 'Lifetime' },
    { name: 'Microsoft Project Professional 2019', slug: 'ms-project-2019-pro', cat: 'projects', price: 3999, mrp: 34999, desc: 'Microsoft Project Professional 2019 License Key', validity: 'Lifetime' },
    { name: 'Microsoft Project Standard 2021', slug: 'ms-project-2021-standard', cat: 'projects', price: 3499, mrp: 29999, desc: 'Microsoft Project Standard 2021 License Key', validity: 'Lifetime' },
    { name: 'Windows Server 2022 Standard', slug: 'windows-server-2022-standard', cat: 'windows-server', price: 7999, mrp: 69999, desc: 'Windows Server 2022 Standard License Key', validity: 'Lifetime' },
    { name: 'Windows Server 2019 Standard', slug: 'windows-server-2019-standard', cat: 'windows-server', price: 6999, mrp: 59999, desc: 'Windows Server 2019 Standard License Key', validity: 'Lifetime' },
    { name: 'Windows Server 2022 Essentials', slug: 'windows-server-2022-essentials', cat: 'windows-server', price: 4999, mrp: 39999, desc: 'Windows Server 2022 Essentials License Key', validity: 'Lifetime' },
    { name: 'Microsoft Visio Professional 2021', slug: 'ms-visio-2021-pro', cat: 'microsoft-visio', price: 3999, mrp: 34999, desc: 'Microsoft Visio Professional 2021 License Key', validity: 'Lifetime' },
    { name: 'Microsoft Visio Professional 2019', slug: 'ms-visio-2019-pro', cat: 'microsoft-visio', price: 3499, mrp: 29999, desc: 'Microsoft Visio Professional 2019 License Key', validity: 'Lifetime' },
    { name: 'Microsoft Visio Standard 2021', slug: 'ms-visio-2021-standard', cat: 'microsoft-visio', price: 2999, mrp: 24999, desc: 'Microsoft Visio Standard 2021 License Key', validity: 'Lifetime' },
    { name: 'Visual Studio 2022 Professional', slug: 'ms-vs-2022-pro', cat: 'ms-visual-studio', price: 5499, mrp: 45999, desc: 'Microsoft Visual Studio 2022 Professional License Key', validity: 'Lifetime' },
    { name: 'Visual Studio 2022 Enterprise', slug: 'ms-vs-2022-enterprise', cat: 'ms-visual-studio', price: 9999, mrp: 89999, desc: 'Microsoft Visual Studio 2022 Enterprise License Key', validity: 'Lifetime' },
    { name: 'Visual Studio 2019 Professional', slug: 'ms-vs-2019-pro', cat: 'ms-visual-studio', price: 4499, mrp: 39999, desc: 'Microsoft Visual Studio 2019 Professional License Key', validity: 'Lifetime' },
  ];

  // Create admin
  const adminExists = await User.findOne({ email: 'admin@pcdealsindia.com' });
  if (!adminExists) {
    await User.create({ name: 'Admin', email: 'admin@pcdealsindia.com', phone: '919999999999', password: 'Admin@123', role: 'admin', isVerified: true });
    console.log('✅ Admin: admin@pcdealsindia.com / Admin@123');
  }

  // Create customer
  const custExists = await User.findOne({ email: 'customer@test.com' });
  if (!custExists) {
    await User.create({ name: 'Test Customer', email: 'customer@test.com', phone: '8888888888', password: 'Test@123', role: 'customer', isVerified: true });
    console.log('✅ Customer: customer@test.com / Test@123');
  }

  // Create categories (upsert)
  const catMap = {};
  for (const cat of cats) {
    const existing = await Category.findOne({ slug: cat.slug });
    if (existing) { catMap[cat.slug] = existing._id; }
    else { const created = await Category.create(cat); catMap[cat.slug] = created._id; }
  }
  console.log(`✅ ${cats.length} categories ready`);

  // Create products + inventory keys
  let prodCount = 0;
  for (const p of prods) {
    const existing = await Product.findOne({ slug: p.slug });
    let product;
    if (existing) {
      product = existing;
    } else {
      product = await Product.create({
        name: p.name,
        slug: p.slug,
        description: p.desc,
        shortDescription: p.desc,
        category: catMap[p.cat],
        price: p.price,
        mrp: p.mrp,
        validity: p.validity,
        isActive: true,
        isFeatured: true,
      });
      prodCount++;
    }
    // Add 5 demo keys per product
    const keyCount = await Inventory.countDocuments({ product: product._id });
    if (keyCount === 0) {
      const keys = [];
      for (let i = 0; i < 5; i++) {
        const key = 'DEMO-' + p.slug.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 8) +
          '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        keys.push({ product: product._id, productName: p.name, key, isUsed: false });
      }
      if (isUsingMongo()) { await Inventory.insertMany(keys); }
      else { for (const k of keys) await Inventory.create(k); }
    }
  }
  console.log(`✅ ${prodCount} new products created (${prods.length} total), keys added`);

  // Settings
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

  console.log('\n🎉 Seed complete!');
  console.log('   Admin:    admin@pcdealsindia.com / Admin@123');
  console.log('   Customer: customer@test.com / Test@123');
  process.exit(0);
})().catch(err => { console.error('Seed failed:', err); process.exit(1); });
