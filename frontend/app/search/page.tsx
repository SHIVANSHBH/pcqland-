'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { Search as SearchIcon } from 'lucide-react';
import Pagination from '@/components/Pagination';

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

const fallbackProducts: Record<string, { name: string; slug: string; price: number; mrp: number; desc: string }[]> = {
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
  ],
  'kaspersky-keys': [
    { name: 'Kaspersky Internet Security 1Y-1PC', slug: 'kaspersky-internet-security-1y', price: 599, mrp: 1999, desc: 'Kaspersky Internet Security - 1 Year / 1 PC' },
    { name: 'Kaspersky Total Security 1Y-3PC', slug: 'kaspersky-total-security-1y', price: 999, mrp: 2999, desc: 'Kaspersky Total Security - 1 Year / 3 PC' },
    { name: 'Kaspersky Antivirus 1Y-1PC', slug: 'kaspersky-antivirus-1y', price: 399, mrp: 1499, desc: 'Kaspersky Antivirus - 1 Year / 1 PC' },
  ],
  'quick-heal': [
    { name: 'Quick Heal Total Security 1Y-1PC', slug: 'quick-heal-total-security-1y', price: 399, mrp: 1499, desc: 'Quick Heal Total Security - 1 Year / 1 PC' },
    { name: 'Quick Heal Antivirus Pro 1Y-1PC', slug: 'quick-heal-antivirus-pro-1y', price: 249, mrp: 799, desc: 'Quick Heal Antivirus Pro - 1 Year / 1 PC' },
  ],
  'eset-keys': [
    { name: 'ESET NOD32 Antivirus 1Y-1PC', slug: 'eset-nod32-1y', price: 499, mrp: 1999, desc: 'ESET NOD32 Antivirus - 1 Year / 1 PC' },
  ],
  'mcafee': [
    { name: 'McAfee Total Protection 1Y-1PC', slug: 'mcafee-total-protection-1y', price: 599, mrp: 2499, desc: 'McAfee Total Protection - 1 Year / 1 PC' },
  ],
  'k7-keys': [
    { name: 'K7 Total Security 1Y-1PC', slug: 'k7-total-security-1y', price: 349, mrp: 1299, desc: 'K7 Total Security - 1 Year / 1 PC' },
  ],
  'guardian-keys': [
    { name: 'Guardian Antivirus 1Y-1PC', slug: 'guardian-antivirus-1y', price: 249, mrp: 899, desc: 'Guardian Antivirus - 1 Year / 1 PC' },
  ],
  'net-protector-keys': [
    { name: 'Net Protector Antivirus 1Y-1PC', slug: 'net-protector-1y', price: 299, mrp: 999, desc: 'Net Protector Antivirus - 1 Year / 1 PC' },
  ],
  'anti-fraud': [
    { name: 'Anti Fraud Standard 1Y-1PC', slug: 'anti-fraud-standard-1y', price: 349, mrp: 1299, desc: 'Anti Fraud Standard Protection - 1 Year / 1 PC' },
  ],
  'projects': [
    { name: 'Microsoft Project Professional 2021', slug: 'ms-project-2021-pro', price: 4999, mrp: 39999, desc: 'Microsoft Project Professional 2021 License Key' },
  ],
  'windows-server': [
    { name: 'Windows Server 2022 Standard', slug: 'windows-server-2022-standard', price: 7999, mrp: 69999, desc: 'Windows Server 2022 Standard License Key' },
  ],
  'microsoft-visio': [
    { name: 'Microsoft Visio Professional 2021', slug: 'ms-visio-2021-pro', price: 3999, mrp: 34999, desc: 'Microsoft Visio Professional 2021 License Key' },
  ],
  'ms-visual-studio': [
    { name: 'Microsoft Visual Studio 2022 Professional', slug: 'ms-vs-2022-pro', price: 5499, mrp: 45999, desc: 'Microsoft Visual Studio 2022 Professional License Key' },
  ],
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const cat = searchParams.get('cat') || '';

  const [results, setResults] = useState<{ name: string; slug: string; price: number; mrp: number; desc: string; catSlug: string }[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    async function doSearch() {
      try {
        const res = await api.get(`/products/search?q=${encodeURIComponent(query)}${cat ? `&cat=${encodeURIComponent(cat)}` : ''}`);
        const apiResults = (res.data || res.products || res).map((p: any) => ({
          name: p.name, slug: p.slug, price: p.price, mrp: p.mrp, desc: p.shortDescription || p.description || '', catSlug: typeof p.category === 'object' ? p.category.slug : cat,
        }));
        if (apiResults.length > 0) { setResults(apiResults); setPage(1); return; }
      } catch {}
      const q = query.toLowerCase();
      const fallback: any[] = [];
      for (const [catSlug, prods] of Object.entries(fallbackProducts)) {
        if (cat && cat !== catSlug) continue;
        for (const p of prods) {
          if (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) {
            fallback.push({ ...p, catSlug });
          }
        }
      }
      setResults(fallback);
      setPage(1);
    }
    doSearch();
  }, [query, cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-pcd-muted mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-pcd-text font-semibold">Search</span>
      </div>

      <h1 className="text-2xl font-extrabold text-pcd-text mb-2">Search Results</h1>
      <p className="text-sm text-pcd-muted mb-6">{query ? `Showing results for "${query}"` : 'Enter a search term to find products'}</p>

      {results.length === 0 && query && (
        <div className="text-center py-12">
          <SearchIcon className="w-12 h-12 mx-auto text-pcd-muted mb-4" />
          <p className="text-pcd-muted">No products found for &ldquo;{query}&rdquo;.</p>
          <Link href="/" className="text-primary hover:underline mt-2 inline-block">Browse all categories</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.slice((page - 1) * perPage, page * perPage).map((product) => {
          const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
          return (
            <Link key={product.slug} href={`/product/${product.slug}`} className="product-card group">
              <div className="relative bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center h-48">
                <Image src={brandIcons[product.catSlug]} alt={product.name} width={80} height={80} className="w-20 h-20 object-contain group-hover:scale-110 transition-transform" />
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

      <Pagination page={page} totalPages={Math.ceil(results.length / perPage)} onPageChange={setPage} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
