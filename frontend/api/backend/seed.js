require('dotenv').config();
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  await connectDB();

  // Clear existing data (skip User to preserve registered users)
  await Category._store.remove({}, { multi: true });
  await Product._store.remove({}, { multi: true });
  // await User._store.remove({}, { multi: true });

  // Create categories
  const cats = await Category.insertMany([
    { _id: 'cat-combo', name: 'Super Saver Combo', slug: 'special-combo-offer', description: 'Save big with combo deals', icon: 'zap', isActive: true, displayOrder: 0 },
    { _id: 'cat-win', name: 'Windows', slug: 'windows-keys', description: 'Genuine Microsoft Windows License Keys', icon: 'windows', isActive: true, displayOrder: 1 },
    { _id: 'cat-off', name: 'Office', slug: 'microsoft-office-keys', description: 'Microsoft Office License Keys', icon: 'office', isActive: true, displayOrder: 2 },
    { _id: 'cat-kasp', name: 'KASPERSKY', slug: 'kaspersky-keys', description: 'Kaspersky Antivirus Keys', icon: 'shield', isActive: true, displayOrder: 3 },
    { _id: 'cat-qh', name: 'QUICK HEAL', slug: 'quick-heal', description: 'Quick Heal Antivirus Keys', icon: 'shield', isActive: true, displayOrder: 4 },
    { _id: 'cat-eset', name: 'ESET', slug: 'eset-keys', description: 'ESET Antivirus Keys', icon: 'shield', isActive: true, displayOrder: 5 },
    { _id: 'cat-k7', name: 'K7 KEYS', slug: 'k7-keys', description: 'K7 Antivirus Keys', icon: 'shield', isActive: true, displayOrder: 6 },
    { _id: 'cat-mcaf', name: 'Mcafee', slug: 'mcafee', description: 'McAfee Antivirus Keys', icon: 'shield', isActive: true, displayOrder: 7 },
    { _id: 'cat-np', name: 'NET PROTECTOR', slug: 'net-protector-keys', description: 'Net Protector Antivirus Keys', icon: 'shield', isActive: true, displayOrder: 8 },
    { _id: 'cat-proj', name: 'MS Projects', slug: 'projects', description: 'Microsoft Project License Keys', icon: 'folder', isActive: true, displayOrder: 9 },
    { _id: 'cat-server', name: 'Windows Server', slug: 'windows-server', description: 'Windows Server License Keys', icon: 'server', isActive: true, displayOrder: 10 },
    { _id: 'cat-visio', name: 'MS Visio', slug: 'microsoft-visio', description: 'Microsoft Visio License Keys', icon: 'file', isActive: true, displayOrder: 11 },
    { _id: 'cat-vs', name: 'MS Visual Studio', slug: 'ms-visual-studio', description: 'Visual Studio License Keys', icon: 'code', isActive: true, displayOrder: 12 },
    { _id: 'cat-af', name: 'Anti Fraud', slug: 'anti-fraud', description: 'Anti Fraud Software Keys', icon: 'lock', isActive: true, displayOrder: 13 },
    { _id: 'cat-guard', name: 'GUARDIAN', slug: 'guardian-keys', description: 'Guardian Antivirus Keys', icon: 'shield', isActive: true, displayOrder: 14 },
  ]);

  // Create products
  await Product.insertMany([
    // Windows
    { name: 'Windows 11 Pro', slug: 'windows-11-pro', description: 'Genuine Microsoft Windows 11 Professional License Key. Lifetime validity. Instant delivery via email & WhatsApp.', shortDescription: 'Genuine Microsoft Windows 11 Pro License Key', category: 'cat-win', price: 1499, mrp: 12999, discount: 88, images: [], validity: 'Lifetime', isActive: true, isFeatured: true, tags: ['windows', 'microsoft', 'os'] },
    { name: 'Windows 11 Home', slug: 'windows-11-home', description: 'Genuine Microsoft Windows 11 Home License Key', shortDescription: 'Genuine Microsoft Windows 11 Home License Key', category: 'cat-win', price: 999, mrp: 8999, discount: 89, images: [], validity: 'Lifetime', isActive: true, isFeatured: true, tags: ['windows', 'microsoft', 'os'] },
    { name: 'Windows 10 Pro', slug: 'windows-10-pro', description: 'Genuine Microsoft Windows 10 Professional License Key', shortDescription: 'Genuine Microsoft Windows 10 Pro License Key', category: 'cat-win', price: 1299, mrp: 10999, discount: 88, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['windows', 'microsoft', 'os'] },
    { name: 'Windows 10 Home', slug: 'windows-10-home', description: 'Genuine Microsoft Windows 10 Home License Key', shortDescription: 'Genuine Microsoft Windows 10 Home License Key', category: 'cat-win', price: 899, mrp: 7999, discount: 89, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['windows', 'microsoft', 'os'] },
    // Office
    { name: 'Microsoft Office 2021 Pro Plus', slug: 'office-2021-pro-plus', description: 'Microsoft Office 2021 Professional Plus License Key', shortDescription: 'Microsoft Office 2021 Professional Plus License Key', category: 'cat-off', price: 2499, mrp: 28999, discount: 91, images: [], validity: 'Lifetime', isActive: true, isFeatured: true, tags: ['office', 'microsoft'] },
    { name: 'Microsoft Office 2019 Pro Plus', slug: 'office-2019-pro-plus', description: 'Microsoft Office 2019 Professional Plus License Key', shortDescription: 'Microsoft Office 2019 Professional Plus License Key', category: 'cat-off', price: 1999, mrp: 24999, discount: 92, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['office', 'microsoft'] },
    { name: 'Microsoft Office 2021 Home Student', slug: 'office-2021-home-student', description: 'Microsoft Office 2021 Home & Student License Key', shortDescription: 'Microsoft Office 2021 Home & Student License Key', category: 'cat-off', price: 1499, mrp: 12999, discount: 88, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['office', 'microsoft'] },
    // Combo
    { name: 'Windows 11 Pro + Office 2021 Pro Plus Combo', slug: 'win11-office2021-combo', description: 'Save big with this combo deal', shortDescription: 'Windows 11 Pro + Office 2021 Pro Plus Combo', category: 'cat-combo', price: 3499, mrp: 41998, discount: 92, images: [], validity: 'Lifetime', isActive: true, isFeatured: true, tags: ['combo', 'windows', 'office'] },
    { name: 'Windows 10 Pro + Office 2019 Pro Plus Combo', slug: 'win10-office2019-combo', description: 'Best value combo for businesses', shortDescription: 'Windows 10 Pro + Office 2019 Pro Plus Combo', category: 'cat-combo', price: 2999, mrp: 35998, discount: 92, images: [], validity: 'Lifetime', isActive: true, isFeatured: true, tags: ['combo', 'windows', 'office'] },
    { name: 'Windows 11 Pro + Office 2021 + Kaspersky Combo', slug: 'win11-office-kaspersky-combo', description: 'Ultimate combo with antivirus', shortDescription: 'Win11 + Office 2021 + Kaspersky Combo', category: 'cat-combo', price: 3999, mrp: 45997, discount: 91, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['combo', 'windows', 'office', 'antivirus'] },
    // Kaspersky
    { name: 'Kaspersky Internet Security 1Y-1PC', slug: 'kaspersky-internet-security-1y', description: 'Kaspersky Internet Security - 1 Year / 1 PC', shortDescription: 'Kaspersky Internet Security - 1 Year / 1 PC', category: 'cat-kasp', price: 599, mrp: 1999, discount: 70, images: [], validity: '1 Year', isActive: true, isFeatured: true, tags: ['antivirus', 'kaspersky'] },
    { name: 'Kaspersky Total Security 1Y-3PC', slug: 'kaspersky-total-security-1y', description: 'Kaspersky Total Security - 1 Year / 3 PC', shortDescription: 'Kaspersky Total Security - 1 Year / 3 PC', category: 'cat-kasp', price: 999, mrp: 2999, discount: 67, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'kaspersky'] },
    { name: 'Kaspersky Total Security 1Y-5PC', slug: 'kaspersky-total-security-5pc', description: 'Kaspersky Total Security - 1 Year / 5 PC', shortDescription: 'Kaspersky Total Security - 1 Year / 5 PC', category: 'cat-kasp', price: 1499, mrp: 4999, discount: 70, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'kaspersky'] },
    { name: 'Kaspersky Antivirus 1Y-1PC', slug: 'kaspersky-antivirus-1y', description: 'Kaspersky Antivirus - 1 Year / 1 PC', shortDescription: 'Kaspersky Antivirus - 1 Year / 1 PC', category: 'cat-kasp', price: 399, mrp: 1499, discount: 73, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'kaspersky'] },
    // Quick Heal
    { name: 'Quick Heal Total Security 1Y-1PC', slug: 'quick-heal-total-security-1y', description: 'Quick Heal Total Security - 1 Year / 1 PC', shortDescription: 'Quick Heal Total Security - 1 Year / 1 PC', category: 'cat-qh', price: 399, mrp: 1499, discount: 73, images: [], validity: '1 Year', isActive: true, isFeatured: true, tags: ['antivirus', 'quick-heal'] },
    { name: 'Quick Heal Internet Security 1Y-1PC', slug: 'quick-heal-internet-security-1y', description: 'Quick Heal Internet Security - 1 Year / 1 PC', shortDescription: 'Quick Heal Internet Security - 1 Year / 1 PC', category: 'cat-qh', price: 299, mrp: 999, discount: 70, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'quick-heal'] },
    { name: 'Quick Heal Total Security 1Y-3PC', slug: 'quick-heal-total-security-3pc', description: 'Quick Heal Total Security - 1 Year / 3 PC', shortDescription: 'Quick Heal Total Security - 1 Year / 3 PC', category: 'cat-qh', price: 699, mrp: 2499, discount: 72, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'quick-heal'] },
    { name: 'Quick Heal Antivirus Pro 1Y-1PC', slug: 'quick-heal-antivirus-pro-1y', description: 'Quick Heal Antivirus Pro - 1 Year / 1 PC', shortDescription: 'Quick Heal Antivirus Pro - 1 Year / 1 PC', category: 'cat-qh', price: 249, mrp: 799, discount: 69, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'quick-heal'] },
    // ESET
    { name: 'ESET NOD32 Antivirus 1Y-1PC', slug: 'eset-nod32-1y', description: 'ESET NOD32 Antivirus - 1 Year / 1 PC', shortDescription: 'ESET NOD32 Antivirus - 1 Year / 1 PC', category: 'cat-eset', price: 499, mrp: 1999, discount: 75, images: [], validity: '1 Year', isActive: true, isFeatured: true, tags: ['antivirus', 'eset'] },
    { name: 'ESET Internet Security 1Y-1PC', slug: 'eset-internet-security-1y', description: 'ESET Internet Security - 1 Year / 1 PC', shortDescription: 'ESET Internet Security - 1 Year / 1 PC', category: 'cat-eset', price: 799, mrp: 2999, discount: 73, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'eset'] },
    { name: 'ESET Smart Security Premium 1Y-1PC', slug: 'eset-smart-security-1y', description: 'ESET Smart Security Premium - 1 Year / 1 PC', shortDescription: 'ESET Smart Security Premium - 1 Year / 1 PC', category: 'cat-eset', price: 1199, mrp: 3999, discount: 70, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'eset'] },
    // K7
    { name: 'K7 Total Security 1Y-1PC', slug: 'k7-total-security-1y', description: 'K7 Total Security - 1 Year / 1 PC', shortDescription: 'K7 Total Security - 1 Year / 1 PC', category: 'cat-k7', price: 349, mrp: 1299, discount: 73, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'k7'] },
    { name: 'K7 Internet Security 1Y-1PC', slug: 'k7-internet-security-1y', description: 'K7 Internet Security - 1 Year / 1 PC', shortDescription: 'K7 Internet Security - 1 Year / 1 PC', category: 'cat-k7', price: 249, mrp: 999, discount: 75, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'k7'] },
    { name: 'K7 Antivirus Pro 1Y-1PC', slug: 'k7-antivirus-pro-1y', description: 'K7 Antivirus Pro - 1 Year / 1 PC', shortDescription: 'K7 Antivirus Pro - 1 Year / 1 PC', category: 'cat-k7', price: 199, mrp: 699, discount: 72, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'k7'] },
    // McAfee
    { name: 'McAfee Total Protection 1Y-1PC', slug: 'mcafee-total-protection-1y', description: 'McAfee Total Protection - 1 Year / 1 PC', shortDescription: 'McAfee Total Protection - 1 Year / 1 PC', category: 'cat-mcaf', price: 599, mrp: 2499, discount: 76, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'mcafee'] },
    { name: 'McAfee Total Protection 1Y-5PC', slug: 'mcafee-total-protection-5pc', description: 'McAfee Total Protection - 1 Year / 5 PC', shortDescription: 'McAfee Total Protection - 1 Year / 5 PC', category: 'cat-mcaf', price: 999, mrp: 3999, discount: 75, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'mcafee'] },
    { name: 'McAfee Internet Security 1Y-1PC', slug: 'mcafee-internet-security-1y', description: 'McAfee Internet Security - 1 Year / 1 PC', shortDescription: 'McAfee Internet Security - 1 Year / 1 PC', category: 'cat-mcaf', price: 449, mrp: 1799, discount: 75, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'mcafee'] },
    // Net Protector
    { name: 'Net Protector Antivirus 1Y-1PC', slug: 'net-protector-1y', description: 'Net Protector Antivirus - 1 Year / 1 PC', shortDescription: 'Net Protector Antivirus - 1 Year / 1 PC', category: 'cat-np', price: 299, mrp: 999, discount: 70, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'net-protector'] },
    { name: 'Net Protector Total Security 1Y-1PC', slug: 'net-protector-total-security-1y', description: 'Net Protector Total Security - 1 Year / 1 PC', shortDescription: 'Net Protector Total Security - 1 Year / 1 PC', category: 'cat-np', price: 499, mrp: 1499, discount: 67, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'net-protector'] },
    // MS Projects
    { name: 'Microsoft Project Professional 2021', slug: 'ms-project-2021-pro', description: 'Microsoft Project Professional 2021 License Key', shortDescription: 'Microsoft Project Professional 2021', category: 'cat-proj', price: 4999, mrp: 39999, discount: 87, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'project'] },
    { name: 'Microsoft Project Professional 2019', slug: 'ms-project-2019-pro', description: 'Microsoft Project Professional 2019 License Key', shortDescription: 'Microsoft Project Professional 2019', category: 'cat-proj', price: 3999, mrp: 34999, discount: 89, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'project'] },
    { name: 'Microsoft Project Standard 2021', slug: 'ms-project-2021-standard', description: 'Microsoft Project Standard 2021 License Key', shortDescription: 'Microsoft Project Standard 2021', category: 'cat-proj', price: 3499, mrp: 29999, discount: 88, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'project'] },
    // Windows Server
    { name: 'Windows Server 2022 Standard', slug: 'windows-server-2022-standard', description: 'Windows Server 2022 Standard License Key', shortDescription: 'Windows Server 2022 Standard', category: 'cat-server', price: 7999, mrp: 69999, discount: 89, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'server'] },
    { name: 'Windows Server 2019 Standard', slug: 'windows-server-2019-standard', description: 'Windows Server 2019 Standard License Key', shortDescription: 'Windows Server 2019 Standard', category: 'cat-server', price: 6999, mrp: 59999, discount: 88, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'server'] },
    { name: 'Windows Server 2022 Essentials', slug: 'windows-server-2022-essentials', description: 'Windows Server 2022 Essentials License Key', shortDescription: 'Windows Server 2022 Essentials', category: 'cat-server', price: 4999, mrp: 39999, discount: 87, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'server'] },
    // MS Visio
    { name: 'Microsoft Visio Professional 2021', slug: 'ms-visio-2021-pro', description: 'Microsoft Visio Professional 2021 License Key', shortDescription: 'Microsoft Visio Professional 2021', category: 'cat-visio', price: 3999, mrp: 34999, discount: 89, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'visio'] },
    { name: 'Microsoft Visio Professional 2019', slug: 'ms-visio-2019-pro', description: 'Microsoft Visio Professional 2019 License Key', shortDescription: 'Microsoft Visio Professional 2019', category: 'cat-visio', price: 3499, mrp: 29999, discount: 88, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'visio'] },
    { name: 'Microsoft Visio Standard 2021', slug: 'ms-visio-2021-standard', description: 'Microsoft Visio Standard 2021 License Key', shortDescription: 'Microsoft Visio Standard 2021', category: 'cat-visio', price: 2999, mrp: 24999, discount: 88, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'visio'] },
    // MS Visual Studio
    { name: 'Microsoft Visual Studio 2022 Professional', slug: 'ms-vs-2022-pro', description: 'Microsoft Visual Studio 2022 Professional License Key', shortDescription: 'MS Visual Studio 2022 Professional', category: 'cat-vs', price: 5499, mrp: 45999, discount: 88, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'visual-studio'] },
    { name: 'Microsoft Visual Studio 2022 Enterprise', slug: 'ms-vs-2022-enterprise', description: 'Microsoft Visual Studio 2022 Enterprise License Key', shortDescription: 'MS Visual Studio 2022 Enterprise', category: 'cat-vs', price: 9999, mrp: 89999, discount: 89, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'visual-studio'] },
    { name: 'Microsoft Visual Studio 2019 Professional', slug: 'ms-vs-2019-pro', description: 'Microsoft Visual Studio 2019 Professional License Key', shortDescription: 'MS Visual Studio 2019 Professional', category: 'cat-vs', price: 4499, mrp: 39999, discount: 89, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: ['microsoft', 'visual-studio'] },
    // Anti Fraud
    { name: 'Anti Fraud Standard 1Y-1PC', slug: 'anti-fraud-standard-1y', description: 'Anti Fraud Standard Protection - 1 Year / 1 PC', shortDescription: 'Anti Fraud Standard - 1 Year / 1 PC', category: 'cat-af', price: 349, mrp: 1299, discount: 73, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'anti-fraud'] },
    { name: 'Anti Fraud Premium 1Y-1PC', slug: 'anti-fraud-premium-1y', description: 'Anti Fraud Premium Protection - 1 Year / 1 PC', shortDescription: 'Anti Fraud Premium - 1 Year / 1 PC', category: 'cat-af', price: 599, mrp: 1999, discount: 70, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'anti-fraud'] },
    // Guardian
    { name: 'Guardian Antivirus 1Y-1PC', slug: 'guardian-antivirus-1y', description: 'Guardian Antivirus - 1 Year / 1 PC', shortDescription: 'Guardian Antivirus - 1 Year / 1 PC', category: 'cat-guard', price: 249, mrp: 899, discount: 72, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'guardian'] },
    { name: 'Guardian Total Security 1Y-1PC', slug: 'guardian-total-security-1y', description: 'Guardian Total Security - 1 Year / 1 PC', shortDescription: 'Guardian Total Security - 1 Year / 1 PC', category: 'cat-guard', price: 399, mrp: 1499, discount: 73, images: [], validity: '1 Year', isActive: true, isFeatured: false, tags: ['antivirus', 'guardian'] },
  ]);

  // Create admin user
  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Admin', email: 'admin@pcdealsindia.com', phone: '9728622667', password: hashed, role: 'admin', isVerified: true });

  // Seed inventory with dummy keys
  const Inventory = require('./models/Inventory');
  const allProducts = await Product.find({});
  const inventoryData = [];
  for (const product of allProducts) {
    for (let i = 0; i < 3; i++) {
      const key = `${product.slug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)}-${Array(5).fill(0).map(() => Math.random().toString(36).substring(2, 6).toUpperCase()).join('-')}`;
      inventoryData.push({ product: product._id, key, validity: product.validity || 'Lifetime' });
    }
  }
  await Inventory.insertMany(inventoryData);
  console.log(`Inventory seeded: ${inventoryData.length} keys added`);

  console.log('Database seeded successfully!');
  console.log('Admin login: admin@pcdealsindia.com / admin123');
  process.exit(0);
}

seed();
