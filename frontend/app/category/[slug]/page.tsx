'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Search } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

const brandIcons: Record<string, string> = {
  'special-combo-offer': '/assets/1776830587.MS win.png',
  'windows-keys': '/assets/1776830587.MS win.png',
  'microsoft-office-keys': '/assets/1776830389.microsoft-office-2019.png',
  'projects': '/assets/1776831162.ms project.png',
  'windows-server': '/assets/1777112945.MS win.png',
  'microsoft-visio': '/assets/1776831414.ms visio icon.png',
  'ms-visual-studio': '/assets/1776831481.Visual_Studio_Icon_2026.svg.png',
  'net-protector-keys': '/assets/1776832684.np av.jpg',
  'quick-heal': '/assets/1776831729.Quick Heal Icon.png',
  'anti-fraud': '/assets/1748147923.1746162050.Anti Fraud.jpg',
  'k7-keys': '/assets/1776757549.k7-removebg-preview.png',
  'guardian-keys': '/assets/1776920398.Guardian new 2.png',
  'kaspersky-keys': '/assets/1776920500.Kaspersky ICON.png',
  'eset-keys': '/assets/1776920604.ESET.jpg',
  'mcafee': '/assets/1776923944.mcafee icon.png',
};

const categories = [
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

const fallbackProducts: Record<string, { name: string; slug: string; price: number; mrp: number; desc: string; image?: string }[]> = {
  'windows-keys': [
    { name: 'Windows 11 Pro', slug: 'windows-11-pro', price: 1499, mrp: 12999, desc: 'Genuine Microsoft Windows 11 Pro License Key' },
    { name: 'Windows 11 Home', slug: 'windows-11-home', price: 999, mrp: 8999, desc: 'Genuine Microsoft Windows 11 Home License Key' },
    { name: 'Windows 10 Pro', slug: 'windows-10-pro', price: 1299, mrp: 10999, desc: 'Genuine Microsoft Windows 10 Pro License Key' },
    { name: 'Windows 10 Home', slug: 'windows-10-home', price: 899, mrp: 7999, desc: 'Genuine Microsoft Windows 10 Home License Key' },
  ],
  'microsoft-office-keys': [
    { name: 'Microsoft Office 2021 Pro Plus', slug: 'office-2021-pro-plus', price: 2499, mrp: 28999, desc: 'Microsoft Office 2021 Professional Plus License Key' },
    { name: 'Microsoft Office 2019 Pro Plus', slug: 'office-2019-pro-plus', price: 1999, mrp: 24999, desc: 'Microsoft Office 2019 Professional Plus License Key' },
    { name: 'Microsoft Office 2021 Home Student', slug: 'office-2021-home-student', price: 1499, mrp: 12999, desc: 'Microsoft Office 2021 Home & Student License Key' },
  ],
  'special-combo-offer': [
    { name: 'Windows 11 Pro + Office 2021 Pro Plus Combo', slug: 'win11-office2021-combo', price: 3499, mrp: 41998, desc: 'Save big with this combo deal' },
    { name: 'Windows 10 Pro + Office 2019 Pro Plus Combo', slug: 'win10-office2019-combo', price: 2999, mrp: 35998, desc: 'Best value combo for businesses' },
    { name: 'Windows 11 Pro + Office 2021 + Kaspersky Combo', slug: 'win11-office-kaspersky-combo', price: 3999, mrp: 45997, desc: 'Ultimate combo with antivirus' },
  ],
  'kaspersky-keys': [
    { name: 'Kaspersky Internet Security 1Y-1PC', slug: 'kaspersky-internet-security-1y', price: 599, mrp: 1999, desc: 'Kaspersky Internet Security - 1 Year / 1 PC' },
    { name: 'Kaspersky Total Security 1Y-3PC', slug: 'kaspersky-total-security-1y', price: 999, mrp: 2999, desc: 'Kaspersky Total Security - 1 Year / 3 PC' },
    { name: 'Kaspersky Total Security 1Y-5PC', slug: 'kaspersky-total-security-5pc', price: 1499, mrp: 4999, desc: 'Kaspersky Total Security - 1 Year / 5 PC' },
    { name: 'Kaspersky Antivirus 1Y-1PC', slug: 'kaspersky-antivirus-1y', price: 399, mrp: 1499, desc: 'Kaspersky Antivirus - 1 Year / 1 PC' },
  ],
  'quick-heal': [
    { name: 'Quick Heal Total Security 1Y-1PC', slug: 'quick-heal-total-security-1y', price: 399, mrp: 1499, desc: 'Quick Heal Total Security - 1 Year / 1 PC' },
    { name: 'Quick Heal Internet Security 1Y-1PC', slug: 'quick-heal-internet-security-1y', price: 299, mrp: 999, desc: 'Quick Heal Internet Security - 1 Year / 1 PC' },
    { name: 'Quick Heal Total Security 1Y-3PC', slug: 'quick-heal-total-security-3pc', price: 699, mrp: 2499, desc: 'Quick Heal Total Security - 1 Year / 3 PC' },
    { name: 'Quick Heal Antivirus Pro 1Y-1PC', slug: 'quick-heal-antivirus-pro-1y', price: 249, mrp: 799, desc: 'Quick Heal Antivirus Pro - 1 Year / 1 PC' },
  ],
  'eset-keys': [
    { name: 'ESET NOD32 Antivirus 1Y-1PC', slug: 'eset-nod32-1y', price: 499, mrp: 1999, desc: 'ESET NOD32 Antivirus - 1 Year / 1 PC' },
    { name: 'ESET Internet Security 1Y-1PC', slug: 'eset-internet-security-1y', price: 799, mrp: 2999, desc: 'ESET Internet Security - 1 Year / 1 PC' },
    { name: 'ESET Smart Security Premium 1Y-1PC', slug: 'eset-smart-security-1y', price: 1199, mrp: 3999, desc: 'ESET Smart Security Premium - 1 Year / 1 PC' },
  ],
  'mcafee': [
    { name: 'McAfee Total Protection 1Y-1PC', slug: 'mcafee-total-protection-1y', price: 599, mrp: 2499, desc: 'McAfee Total Protection - 1 Year / 1 PC' },
    { name: 'McAfee Total Protection 1Y-5PC', slug: 'mcafee-total-protection-5pc', price: 999, mrp: 3999, desc: 'McAfee Total Protection - 1 Year / 5 PC' },
    { name: 'McAfee Internet Security 1Y-1PC', slug: 'mcafee-internet-security-1y', price: 449, mrp: 1799, desc: 'McAfee Internet Security - 1 Year / 1 PC' },
  ],
  'k7-keys': [
    { name: 'K7 Total Security 1Y-1PC', slug: 'k7-total-security-1y', price: 349, mrp: 1299, desc: 'K7 Total Security - 1 Year / 1 PC' },
    { name: 'K7 Internet Security 1Y-1PC', slug: 'k7-internet-security-1y', price: 249, mrp: 999, desc: 'K7 Internet Security - 1 Year / 1 PC' },
    { name: 'K7 Antivirus Pro 1Y-1PC', slug: 'k7-antivirus-pro-1y', price: 199, mrp: 699, desc: 'K7 Antivirus Pro - 1 Year / 1 PC' },
  ],
  'net-protector-keys': [
    { name: 'Net Protector Antivirus 1Y-1PC', slug: 'net-protector-1y', price: 299, mrp: 999, desc: 'Net Protector Antivirus - 1 Year / 1 PC' },
    { name: 'Net Protector Total Security 1Y-1PC', slug: 'net-protector-total-security-1y', price: 499, mrp: 1499, desc: 'Net Protector Total Security - 1 Year / 1 PC' },
  ],
  'guardian-keys': [
    { name: 'Guardian Antivirus 1Y-1PC', slug: 'guardian-antivirus-1y', price: 249, mrp: 899, desc: 'Guardian Antivirus - 1 Year / 1 PC' },
    { name: 'Guardian Total Security 1Y-1PC', slug: 'guardian-total-security-1y', price: 399, mrp: 1499, desc: 'Guardian Total Security - 1 Year / 1 PC' },
  ],
  'anti-fraud': [
    { name: 'Anti Fraud Standard 1Y-1PC', slug: 'anti-fraud-standard-1y', price: 349, mrp: 1299, desc: 'Anti Fraud Standard Protection - 1 Year / 1 PC' },
    { name: 'Anti Fraud Premium 1Y-1PC', slug: 'anti-fraud-premium-1y', price: 599, mrp: 1999, desc: 'Anti Fraud Premium Protection - 1 Year / 1 PC' },
  ],
  'projects': [
    { name: 'Microsoft Project Professional 2021', slug: 'ms-project-2021-pro', price: 4999, mrp: 39999, desc: 'Microsoft Project Professional 2021 License Key' },
    { name: 'Microsoft Project Professional 2019', slug: 'ms-project-2019-pro', price: 3999, mrp: 34999, desc: 'Microsoft Project Professional 2019 License Key' },
    { name: 'Microsoft Project Standard 2021', slug: 'ms-project-2021-standard', price: 3499, mrp: 29999, desc: 'Microsoft Project Standard 2021 License Key' },
  ],
  'windows-server': [
    { name: 'Windows Server 2022 Standard', slug: 'windows-server-2022-standard', price: 7999, mrp: 69999, desc: 'Windows Server 2022 Standard License Key' },
    { name: 'Windows Server 2019 Standard', slug: 'windows-server-2019-standard', price: 6999, mrp: 59999, desc: 'Windows Server 2019 Standard License Key' },
    { name: 'Windows Server 2022 Essentials', slug: 'windows-server-2022-essentials', price: 4999, mrp: 39999, desc: 'Windows Server 2022 Essentials License Key' },
  ],
  'microsoft-visio': [
    { name: 'Microsoft Visio Professional 2021', slug: 'ms-visio-2021-pro', price: 3999, mrp: 34999, desc: 'Microsoft Visio Professional 2021 License Key' },
    { name: 'Microsoft Visio Professional 2019', slug: 'ms-visio-2019-pro', price: 3499, mrp: 29999, desc: 'Microsoft Visio Professional 2019 License Key' },
    { name: 'Microsoft Visio Standard 2021', slug: 'ms-visio-2021-standard', price: 2999, mrp: 24999, desc: 'Microsoft Visio Standard 2021 License Key' },
  ],
  'ms-visual-studio': [
    { name: 'Microsoft Visual Studio 2022 Professional', slug: 'ms-vs-2022-pro', price: 5499, mrp: 45999, desc: 'Microsoft Visual Studio 2022 Professional License Key' },
    { name: 'Microsoft Visual Studio 2022 Enterprise', slug: 'ms-vs-2022-enterprise', price: 9999, mrp: 89999, desc: 'Microsoft Visual Studio 2022 Enterprise License Key' },
    { name: 'Microsoft Visual Studio 2019 Professional', slug: 'ms-vs-2019-pro', price: 4499, mrp: 39999, desc: 'Microsoft Visual Studio 2019 Professional License Key' },
  ],
};

interface PageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = params;
  const [search, setSearch] = useState('');
  const [apiProducts, setApiProducts] = useState<any[] | null>(null);

  useEffect(() => {
    api.get(`/categories/${slug}/products`)
      .then(data => setApiProducts(data))
      .catch(() => setApiProducts(null));
  }, [slug]);

  const catName = categories.find(c => c.slug === slug)?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const displayProducts = apiProducts && apiProducts.length > 0
    ? apiProducts.map((p: any) => ({
        name: p.name,
        slug: p.slug,
        price: p.price,
        mrp: p.mrp,
        desc: p.shortDescription || p.description,
        image: p.images?.[0],
      }))
    : (fallbackProducts[slug] || []);

  const filtered = displayProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-pcd-muted mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-pcd-text font-semibold">{catName}</span>
      </div>

      <h1 className="text-2xl font-extrabold text-pcd-text mb-2">{catName}</h1>
      <p className="text-sm text-pcd-muted mb-6">Browse our collection of genuine {catName} license keys</p>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pcd-muted" />
        <input
          type="text"
          placeholder="Search in this category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
        />
      </div>

      {apiProducts === null && fallbackProducts[slug] === undefined ? (
        <ProductGridSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-pcd-muted">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
            return (
              <Link key={product.slug} href={`/product/${product.slug}`} className="product-card group">
                <div className="relative bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center h-48">
                  <Image src={product.image || brandIcons[slug]} alt={product.name} width={80} height={80} className="w-20 h-20 object-contain group-hover:scale-110 transition-transform" />
                  {discount > 0 && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-pcd-text mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-xs text-pcd-muted mb-3 line-clamp-2">{product.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-extrabold text-primary">{formatPrice(product.price)}</span>
                    <span className="text-sm text-pcd-muted line-through">{formatPrice(product.mrp)}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Instant Delivery
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
