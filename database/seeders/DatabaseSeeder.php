<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductPriceSlab;
use App\Models\Review;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Categories
        $windowsCat = Category::create([
            'name' => 'Windows OS Keys',
            'slug' => 'windows-os-keys',
            'description' => 'Genuine Microsoft Windows activation keys for all versions.',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $officeCat = Category::create([
            'name' => 'Microsoft Office Keys',
            'slug' => 'microsoft-office-keys',
            'description' => 'Microsoft Office licenses for home and business.',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        $serverCat = Category::create([
            'name' => 'Windows Server Keys',
            'slug' => 'windows-server-keys',
            'description' => 'Windows Server 2016, 2019, 2022 activation keys.',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        $otherCat = Category::create([
            'name' => 'Other Software',
            'slug' => 'other-software',
            'description' => 'Antivirus, VPN, and other software licenses.',
            'is_active' => true,
            'sort_order' => 4,
        ]);

        // Subcategories
        $win10Cat = Category::create([
            'name' => 'Windows 10',
            'slug' => 'windows-10',
            'description' => 'Windows 10 Home, Pro, Enterprise keys.',
            'is_active' => true,
            'sort_order' => 1,
            'parent_id' => $windowsCat->id,
        ]);

        $win11Cat = Category::create([
            'name' => 'Windows 11',
            'slug' => 'windows-11',
            'description' => 'Windows 11 Home, Pro, Enterprise keys.',
            'is_active' => true,
            'sort_order' => 2,
            'parent_id' => $windowsCat->id,
        ]);

        // Products
        $win10Pro = Product::create([
            'category_id' => $win10Cat->id,
            'name' => 'Windows 10 Professional License Key',
            'slug' => 'windows-10-professional-license-key',
            'short_description' => 'Genuine Windows 10 Pro license key — instant email delivery, lifetime activation, no subscription.',
            'description_html' => '<p>Get an authentic Windows 10 Professional license key delivered instantly to your email. Lifetime activation with no recurring fees.</p><ul><li>Full-featured Windows 10 Pro</li><li>Supports BitLocker, Remote Desktop, Hyper-V</li><li>Lifetime license — one-time purchase</li><li>Instant delivery via email</li></ul>',
            'min_qty' => 1,
            'max_qty' => 100,
            'base_price' => 390.00,
            'cashback_per_unit' => 10.00,
            'is_active' => true,
            'seo_title' => 'Buy Windows 10 Pro License Key Online - PCQLand',
            'seo_description' => 'Buy Windows 10 Professional license key at best price. Instant email delivery. Lifetime activation. Trusted by 10,000+ customers.',
        ]);

        $win10Home = Product::create([
            'category_id' => $win10Cat->id,
            'name' => 'Windows 10 Home License Key',
            'slug' => 'windows-10-home-license-key',
            'short_description' => 'Genuine Windows 10 Home key — instant delivery, lifetime activation, best price guaranteed.',
            'description_html' => '<p>Authentic Windows 10 Home license key delivered instantly. Perfect for personal computers and home use.</p><ul><li>Windows 10 Home full version</li><li>Cortana, Edge, and all consumer features</li><li>Lifetime license — one-time purchase</li><li>Instant delivery via email</li></ul>',
            'min_qty' => 1,
            'max_qty' => 100,
            'base_price' => 290.00,
            'cashback_per_unit' => 10.00,
            'is_active' => true,
            'seo_title' => 'Buy Windows 10 Home License Key - PCQLand',
            'seo_description' => 'Buy Windows 10 Home license key online at lowest price. Instant email delivery. Lifetime activation.',
        ]);

        $win11Pro = Product::create([
            'category_id' => $win11Cat->id,
            'name' => 'Windows 11 Professional License Key',
            'slug' => 'windows-11-professional-license-key',
            'short_description' => 'Genuine Windows 11 Pro license key — instant email delivery, lifetime activation, best price.',
            'description_html' => '<p>Upgrade to Windows 11 Professional with an authentic license key delivered instantly.</p><ul><li>Windows 11 Pro full version</li><li>BitLocker, Remote Desktop, Hyper-V, WSL</li><li>Lifetime license — one-time purchase</li><li>Instant delivery via email</li></ul>',
            'min_qty' => 1,
            'max_qty' => 100,
            'base_price' => 490.00,
            'cashback_per_unit' => 15.00,
            'is_active' => true,
            'seo_title' => 'Buy Windows 11 Pro License Key - PCQLand',
            'seo_description' => 'Buy Windows 11 Professional license key at best price. Instant delivery. Lifetime activation.',
        ]);

        $win11Home = Product::create([
            'category_id' => $win11Cat->id,
            'name' => 'Windows 11 Home License Key',
            'slug' => 'windows-11-home-license-key',
            'short_description' => 'Genuine Windows 11 Home key — instant email delivery, lifetime activation.',
            'description_html' => '<p>Authentic Windows 11 Home license key for your personal computer. Fast email delivery.</p><ul><li>Windows 11 Home full version</li><li>All consumer features including Copilot AI</li><li>Lifetime license — one-time purchase</li><li>Instant delivery via email</li></ul>',
            'min_qty' => 1,
            'max_qty' => 100,
            'base_price' => 390.00,
            'cashback_per_unit' => 10.00,
            'is_active' => true,
            'seo_title' => 'Buy Windows 11 Home License Key - PCQLand',
            'seo_description' => 'Buy Windows 11 Home license key online. Instant delivery. Lifetime activation. Best price guaranteed.',
        ]);

        // Office products
        $office2021Pro = Product::create([
            'category_id' => $officeCat->id,
            'name' => 'Microsoft Office 2021 Professional Plus License Key',
            'slug' => 'office-2021-professional-plus-license-key',
            'short_description' => 'Microsoft Office 2021 Pro Plus key — Word, Excel, PowerPoint, Outlook, and more. Lifetime license.',
            'description_html' => '<p>Microsoft Office 2021 Professional Plus — the complete office suite with all premium apps.</p><ul><li>Word, Excel, PowerPoint, Outlook, Access, Publisher</li><li>Lifetime license — one-time purchase</li><li>1 PC / 1 user</li><li>Instant delivery via email</li></ul>',
            'min_qty' => 1,
            'max_qty' => 50,
            'base_price' => 1490.00,
            'cashback_per_unit' => 25.00,
            'is_active' => true,
            'seo_title' => 'Buy Office 2021 Professional Plus Key - PCQLand',
            'seo_description' => 'Buy Microsoft Office 2021 Professional Plus license key at best price. Instant delivery. Lifetime activation.',
        ]);

        $office2021Home = Product::create([
            'category_id' => $officeCat->id,
            'name' => 'Microsoft Office 2021 Home & Student License Key',
            'slug' => 'office-2021-home-student-license-key',
            'short_description' => 'Office 2021 Home & Student — Word, Excel, PowerPoint. Perfect for students and home users.',
            'description_html' => '<p>Microsoft Office 2021 Home & Student — essential apps for your daily work.</p><ul><li>Word, Excel, PowerPoint</li><li>Lifetime license — one-time purchase</li><li>1 PC / 1 user</li><li>Instant delivery</li></ul>',
            'min_qty' => 1,
            'max_qty' => 50,
            'base_price' => 990.00,
            'cashback_per_unit' => 15.00,
            'is_active' => true,
            'seo_title' => 'Buy Office 2021 Home & Student Key - PCQLand',
            'seo_description' => 'Buy Microsoft Office 2021 Home & Student license key at best price. Instant delivery.',
        ]);

        // Price slabs for each product
        $slabConfigs = [
            [$win10Pro->id, [
                [1, 390, 'Buy 1 - ₹390', 1],
                [3, 365, 'Buy 3 - ₹365 each', 2],
                [5, 345, 'Buy 5 - ₹345 each', 3],
                [10, 325, 'Buy 10 - ₹325 each', 4],
            ]],
            [$win10Home->id, [
                [1, 290, 'Buy 1 - ₹290', 1],
                [3, 275, 'Buy 3 - ₹275 each', 2],
                [5, 260, 'Buy 5 - ₹260 each', 3],
            ]],
            [$win11Pro->id, [
                [1, 490, 'Buy 1 - ₹490', 1],
                [3, 460, 'Buy 3 - ₹460 each', 2],
                [5, 435, 'Buy 5 - ₹435 each', 3],
            ]],
            [$win11Home->id, [
                [1, 390, 'Buy 1 - ₹390', 1],
                [3, 365, 'Buy 3 - ₹365 each', 2],
                [5, 345, 'Buy 5 - ₹345 each', 3],
            ]],
            [$office2021Pro->id, [
                [1, 1490, 'Buy 1 - ₹1,490', 1],
                [3, 1390, 'Buy 3 - ₹1,390 each', 2],
                [5, 1290, 'Buy 5 - ₹1,290 each', 3],
            ]],
            [$office2021Home->id, [
                [1, 990, 'Buy 1 - ₹990', 1],
                [3, 920, 'Buy 3 - ₹920 each', 2],
                [5, 860, 'Buy 5 - ₹860 each', 3],
            ]],
        ];

        foreach ($slabConfigs as [$prodId, $slabs]) {
            foreach ($slabs as [$qty, $price, $label, $sort]) {
                ProductPriceSlab::create([
                    'product_id' => $prodId,
                    'qty' => $qty,
                    'unit_price' => $price,
                    'label' => $label,
                    'sort_order' => $sort,
                ]);
            }
        }

        // Sample reviews
        $reviews = [
            [
                'name' => 'Rahul Sharma',
                'city' => 'Delhi',
                'state' => 'Delhi',
                'description' => 'Excellent service! Got my Windows 10 Pro key in under 5 minutes. Activated without any issues. Highly recommended.',
                'is_approved' => true,
            ],
            [
                'name' => 'Priya Patel',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'description' => 'Best prices for genuine licenses. I have purchased multiple Office keys for my business. Fast delivery every time.',
                'is_approved' => true,
            ],
            [
                'name' => 'Amit Singh',
                'city' => 'Bangalore',
                'state' => 'Karnataka',
                'description' => 'Very satisfied with the purchase. The key was delivered instantly and worked perfectly. Will buy again.',
                'is_approved' => true,
            ],
            [
                'name' => 'Sneha Reddy',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
                'description' => 'Great customer support. I had a small activation query and it was resolved within minutes. Trustworthy seller.',
                'is_approved' => true,
            ],
            [
                'name' => 'Vikram Joshi',
                'city' => 'Pune',
                'state' => 'Maharashtra',
                'description' => 'Switched from a monthly subscription to a lifetime license. Saved so much money. The key works flawlessly.',
                'is_approved' => true,
            ],
            [
                'name' => 'Ananya Gupta',
                'city' => 'Kolkata',
                'state' => 'West Bengal',
                'description' => 'Legit keys at unbeatable prices. I recommended PCQLand to all my friends and family. 5 stars!',
                'is_approved' => true,
            ],
        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }
    }
}
