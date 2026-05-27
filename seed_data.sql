-- Categories (parent)
INSERT INTO categories (name, slug, description, is_active, sort_order) VALUES
('Windows OS Keys', 'windows-os-keys', 'Genuine Microsoft Windows activation keys for all versions.', true, 1),
('Microsoft Office Keys', 'microsoft-office-keys', 'Microsoft Office licenses for home and business.', true, 2),
('Windows Server Keys', 'windows-server-keys', 'Windows Server 2016, 2019, 2022 activation keys.', true, 3),
('Other Software', 'other-software', 'Antivirus, VPN, and other software licenses.', true, 4);

-- Subcategories (use id from parent inserts above - windows-os-keys id)
INSERT INTO categories (parent_id, name, slug, description, is_active, sort_order)
SELECT c.id, 'Windows 10', 'windows-10', 'Windows 10 Home, Pro, Enterprise keys.', true, 1
FROM categories c WHERE c.slug = 'windows-os-keys';

INSERT INTO categories (parent_id, name, slug, description, is_active, sort_order)
SELECT c.id, 'Windows 11', 'windows-11', 'Windows 11 Home, Pro, Enterprise keys.', true, 2
FROM categories c WHERE c.slug = 'windows-os-keys';

-- Products
INSERT INTO products (category_id, name, slug, short_description, description_html, min_qty, max_qty, base_price, cashback_per_unit, is_active, seo_title, seo_description)
SELECT c.id, 'Windows 10 Professional License Key', 'windows-10-professional-license-key',
 'Genuine Windows 10 Pro license key — instant email delivery, lifetime activation, no subscription.',
 '<p>Get an authentic Windows 10 Professional license key delivered instantly to your email. Lifetime activation with no recurring fees.</p><ul><li>Full-featured Windows 10 Pro</li><li>Supports BitLocker, Remote Desktop, Hyper-V</li><li>Lifetime license — one-time purchase</li><li>Instant delivery via email</li></ul>',
 1, 100, 390.00, 10.00, true,
 'Buy Windows 10 Pro License Key Online - PCQLand',
 'Buy Windows 10 Professional license key at best price. Instant email delivery. Lifetime activation. Trusted by 10,000+ customers.'
FROM categories c WHERE c.slug = 'windows-10';

INSERT INTO products (category_id, name, slug, short_description, description_html, min_qty, max_qty, base_price, cashback_per_unit, is_active, seo_title, seo_description)
SELECT c.id, 'Windows 10 Home License Key', 'windows-10-home-license-key',
 'Genuine Windows 10 Home key — instant delivery, lifetime activation, best price guaranteed.',
 '<p>Authentic Windows 10 Home license key delivered instantly. Perfect for personal computers and home use.</p><ul><li>Windows 10 Home full version</li><li>Cortana, Edge, and all consumer features</li><li>Lifetime license — one-time purchase</li><li>Instant delivery via email</li></ul>',
 1, 100, 290.00, 10.00, true,
 'Buy Windows 10 Home License Key - PCQLand',
 'Buy Windows 10 Home license key online at lowest price. Instant email delivery. Lifetime activation.'
FROM categories c WHERE c.slug = 'windows-10';

INSERT INTO products (category_id, name, slug, short_description, description_html, min_qty, max_qty, base_price, cashback_per_unit, is_active, seo_title, seo_description)
SELECT c.id, 'Windows 11 Professional License Key', 'windows-11-professional-license-key',
 'Genuine Windows 11 Pro license key — instant email delivery, lifetime activation, best price.',
 '<p>Upgrade to Windows 11 Professional with an authentic license key delivered instantly.</p><ul><li>Windows 11 Pro full version</li><li>BitLocker, Remote Desktop, Hyper-V, WSL</li><li>Lifetime license — one-time purchase</li><li>Instant delivery via email</li></ul>',
 1, 100, 490.00, 15.00, true,
 'Buy Windows 11 Pro License Key - PCQLand',
 'Buy Windows 11 Professional license key at best price. Instant delivery. Lifetime activation.'
FROM categories c WHERE c.slug = 'windows-11';

INSERT INTO products (category_id, name, slug, short_description, description_html, min_qty, max_qty, base_price, cashback_per_unit, is_active, seo_title, seo_description)
SELECT c.id, 'Windows 11 Home License Key', 'windows-11-home-license-key',
 'Genuine Windows 11 Home key — instant email delivery, lifetime activation.',
 '<p>Authentic Windows 11 Home license key for your personal computer. Fast email delivery.</p><ul><li>Windows 11 Home full version</li><li>All consumer features including Copilot AI</li><li>Lifetime license — one-time purchase</li><li>Instant delivery via email</li></ul>',
 1, 100, 390.00, 10.00, true,
 'Buy Windows 11 Home License Key - PCQLand',
 'Buy Windows 11 Home license key online. Instant delivery. Lifetime activation. Best price guaranteed.'
FROM categories c WHERE c.slug = 'windows-11';

INSERT INTO products (category_id, name, slug, short_description, description_html, min_qty, max_qty, base_price, cashback_per_unit, is_active, seo_title, seo_description)
SELECT c.id, 'Microsoft Office 2021 Professional Plus License Key', 'office-2021-professional-plus-license-key',
 'Microsoft Office 2021 Pro Plus key — Word, Excel, PowerPoint, Outlook, and more. Lifetime license.',
 '<p>Microsoft Office 2021 Professional Plus — the complete office suite with all premium apps.</p><ul><li>Word, Excel, PowerPoint, Outlook, Access, Publisher</li><li>Lifetime license — one-time purchase</li><li>1 PC / 1 user</li><li>Instant delivery via email</li></ul>',
 1, 50, 1490.00, 25.00, true,
 'Buy Office 2021 Professional Plus Key - PCQLand',
 'Buy Microsoft Office 2021 Professional Plus license key at best price. Instant delivery. Lifetime activation.'
FROM categories c WHERE c.slug = 'microsoft-office-keys';

INSERT INTO products (category_id, name, slug, short_description, description_html, min_qty, max_qty, base_price, cashback_per_unit, is_active, seo_title, seo_description)
SELECT c.id, 'Microsoft Office 2021 Home & Student License Key', 'office-2021-home-student-license-key',
 'Office 2021 Home & Student — Word, Excel, PowerPoint. Perfect for students and home users.',
 '<p>Microsoft Office 2021 Home & Student — essential apps for your daily work.</p><ul><li>Word, Excel, PowerPoint</li><li>Lifetime license — one-time purchase</li><li>1 PC / 1 user</li><li>Instant delivery</li></ul>',
 1, 50, 990.00, 15.00, true,
 'Buy Office 2021 Home & Student Key - PCQLand',
 'Buy Microsoft Office 2021 Home & Student license key at best price. Instant delivery.'
FROM categories c WHERE c.slug = 'microsoft-office-keys';

-- Product price slabs
INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 1, 390, 'Buy 1 - ₹390', 1
FROM products p WHERE p.slug = 'windows-10-professional-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 3, 365, 'Buy 3 - ₹365 each', 2
FROM products p WHERE p.slug = 'windows-10-professional-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 5, 345, 'Buy 5 - ₹345 each', 3
FROM products p WHERE p.slug = 'windows-10-professional-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 10, 325, 'Buy 10 - ₹325 each', 4
FROM products p WHERE p.slug = 'windows-10-professional-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 1, 290, 'Buy 1 - ₹290', 1
FROM products p WHERE p.slug = 'windows-10-home-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 3, 275, 'Buy 3 - ₹275 each', 2
FROM products p WHERE p.slug = 'windows-10-home-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 5, 260, 'Buy 5 - ₹260 each', 3
FROM products p WHERE p.slug = 'windows-10-home-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 1, 490, 'Buy 1 - ₹490', 1
FROM products p WHERE p.slug = 'windows-11-professional-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 3, 460, 'Buy 3 - ₹460 each', 2
FROM products p WHERE p.slug = 'windows-11-professional-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 5, 435, 'Buy 5 - ₹435 each', 3
FROM products p WHERE p.slug = 'windows-11-professional-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 1, 390, 'Buy 1 - ₹390', 1
FROM products p WHERE p.slug = 'windows-11-home-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 3, 365, 'Buy 3 - ₹365 each', 2
FROM products p WHERE p.slug = 'windows-11-home-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 5, 345, 'Buy 5 - ₹345 each', 3
FROM products p WHERE p.slug = 'windows-11-home-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 1, 1490, 'Buy 1 - ₹1,490', 1
FROM products p WHERE p.slug = 'office-2021-professional-plus-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 3, 1390, 'Buy 3 - ₹1,390 each', 2
FROM products p WHERE p.slug = 'office-2021-professional-plus-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 5, 1290, 'Buy 5 - ₹1,290 each', 3
FROM products p WHERE p.slug = 'office-2021-professional-plus-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 1, 990, 'Buy 1 - ₹990', 1
FROM products p WHERE p.slug = 'office-2021-home-student-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 3, 920, 'Buy 3 - ₹920 each', 2
FROM products p WHERE p.slug = 'office-2021-home-student-license-key';

INSERT INTO product_price_slabs (product_id, qty, unit_price, label, sort_order)
SELECT p.id, 5, 860, 'Buy 5 - ₹860 each', 3
FROM products p WHERE p.slug = 'office-2021-home-student-license-key';

-- Reviews
INSERT INTO reviews (name, city, state, description, is_approved) VALUES
('Rahul Sharma', 'Delhi', 'Delhi', 'Excellent service! Got my Windows 10 Pro key in under 5 minutes. Activated without any issues. Highly recommended.', true),
('Priya Patel', 'Mumbai', 'Maharashtra', 'Best prices for genuine licenses. I have purchased multiple Office keys for my business. Fast delivery every time.', true),
('Amit Singh', 'Bangalore', 'Karnataka', 'Very satisfied with the purchase. The key was delivered instantly and worked perfectly. Will buy again.', true),
('Sneha Reddy', 'Hyderabad', 'Telangana', 'Great customer support. I had a small activation query and it was resolved within minutes. Trustworthy seller.', true),
('Vikram Joshi', 'Pune', 'Maharashtra', 'Switched from a monthly subscription to a lifetime license. Saved so much money. The key works flawlessly.', true),
('Ananya Gupta', 'Kolkata', 'West Bengal', 'Legit keys at unbeatable prices. I recommended PCQLand to all my friends and family. 5 stars!', true);
