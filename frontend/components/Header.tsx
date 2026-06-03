'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Image from 'next/image';
import { Search, User, ShoppingCart, Menu, X, ChevronDown, Phone, Headphones } from 'lucide-react';

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
  { name: 'Super Saver Combo', slug: 'special-combo-offer', icon: brandIcons['special-combo-offer'] },
  { name: 'Windows', slug: 'windows-keys', icon: brandIcons['windows-keys'] },
  { name: 'Office', slug: 'microsoft-office-keys', icon: brandIcons['microsoft-office-keys'] },
  { name: 'MS Projects', slug: 'projects', icon: brandIcons['projects'] },
  { name: 'Windows Server', slug: 'windows-server', icon: brandIcons['windows-server'] },
  { name: 'MS Visio', slug: 'microsoft-visio', icon: brandIcons['microsoft-visio'] },
  { name: 'MS Visual Studio', slug: 'ms-visual-studio', icon: brandIcons['ms-visual-studio'] },
  { name: 'NET PROTECTOR', slug: 'net-protector-keys', icon: brandIcons['net-protector-keys'] },
  { name: 'QUICK HEAL', slug: 'quick-heal', icon: brandIcons['quick-heal'], children: ['QUICK HEAL PRO', 'QUICK HEAL TOTAL SEC', 'QUICK HEAL INTERNET SEC', 'QUICK HEAL SERVER', 'QUICK HEAL RENEWAL KEYS'] },
  { name: 'Anti Fraud', slug: 'anti-fraud', icon: brandIcons['anti-fraud'] },
  { name: 'K7 KEYS', slug: 'k7-keys', icon: brandIcons['k7-keys'] },
  { name: 'GUARDIAN', slug: 'guardian-keys', icon: brandIcons['guardian-keys'] },
  { name: 'KASPERSKY', slug: 'kaspersky-keys', icon: brandIcons['kaspersky-keys'] },
  { name: 'ESET', slug: 'eset-keys', icon: brandIcons['eset-keys'] },
  { name: 'Mcafee', slug: 'mcafee', icon: brandIcons['mcafee'] },
];

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [logo, setLogo] = useState('');
  const [searchCat, setSearchCat] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector<HTMLInputElement>('input[name="search"]');
    const q = input?.value || '';
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}${searchCat !== 'all' ? `&cat=${searchCat}` : ''}`);
  }

  useEffect(() => {
    const cachedMe = sessionStorage.getItem('_auth_me');
    if (cachedMe) {
      try { const d = JSON.parse(cachedMe); setIsLoggedIn(true); setUserName(d.data?.name || ''); } catch {}
    } else {
      api.get('/auth/me').then(d => {
        if (d && d.data) {
          setIsLoggedIn(true);
          setUserName(d.data.name || '');
          try { sessionStorage.setItem('_auth_me', JSON.stringify(d)); } catch {}
        }
      }).catch(() => setIsLoggedIn(false));
    }
    const cachedSettings = sessionStorage.getItem('_settings');
    if (cachedSettings) {
      try { const s = JSON.parse(cachedSettings); if (s.logo) setLogo(s.logo); } catch {}
    } else {
      api.get('/admin/settings').then(s => {
        if (s.logo) setLogo(s.logo);
        try { sessionStorage.setItem('_settings', JSON.stringify(s)); } catch {}
      }).catch(() => {});
    }
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount((Array.isArray(cart) ? cart : []).reduce((sum: number, i: any) => sum + (i.quantity || 1), 0));
    } catch {}
    const handleCart = () => {
      try {
        const c = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount((Array.isArray(c) ? c : []).reduce((sum: number, i: any) => sum + (i.quantity || 1), 0));
      } catch {}
    };
    window.addEventListener('storage', handleCart);
    return () => window.removeEventListener('storage', handleCart);
  }, []);

  const handleLogout = async () => {
    try { await api.post('/auth/logout', {}); } catch {}
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header className="bg-white">
      {/* Top Strip */}
      <div className="top-strip">
        <div className="flex items-center gap-2">
          <Headphones className="w-3.5 h-3.5" />
          <span>Technical Help? 98445-39000 | Sales: 97286-22667 (Mon - Sat, 11 AM - 7 PM)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Instant Delivery</span>
          <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 100% Genuine Keys</span>
          <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> Secure Payment</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-head px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-1 sm:gap-2">
              {logo ? (
                <Image src={logo} alt="PC Deals India" width={120} height={40} className="h-8 sm:h-10 w-auto sm:max-w-[180px] object-contain" unoptimized />
              ) : (
                <Image src="/assets/1565303531.shree hira computer Logo for WebSite.png" alt="PC Deals India" width={120} height={40} className="h-8 sm:h-10 w-auto" />
              )}
              <div className="hidden lg:block">
                <h1 className="text-sm font-extrabold text-pcd-text leading-tight">PC Deals India</h1>
                <p className="text-[10px] sm:text-xs text-pcd-muted">Genuine Software Keys</p>
              </div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="search-wrap flex-1 max-w-2xl">
            <div className="cat-picker" ref={searchRef}>
              <button type="button" className="cat-picker-toggle" onClick={() => setSearchOpen(!searchOpen)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                <span>{searchCat === 'all' ? 'All Categories' : categories.find(c => c.slug === searchCat)?.name || 'All Categories'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {searchOpen && (
                <div className="cat-picker-menu" style={{ display: 'block' }}>
                  <button type="button" className={`cat-option${searchCat === 'all' ? ' active' : ''}`} onClick={() => { setSearchCat('all'); setSearchOpen(false); }}>All Categories</button>
                  {categories.map((cat) => (
                    <button key={cat.slug} type="button" className={`cat-option${searchCat === cat.slug ? ' active' : ''}`} onClick={() => { setSearchCat(cat.slug); setSearchOpen(false); }}>{cat.name}</button>
                  ))}
                </div>
              )}
            </div>
            <input className="search-input" type="search" name="search" placeholder="Search for products, software, keys..." />
            <button type="submit" className="search-btn" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/cart" className="relative p-1.5 sm:p-2.5 text-pcd-text hover:text-primary transition-colors">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2.5 text-sm font-medium text-pcd-text hover:text-primary transition-colors" aria-haspopup="true" aria-expanded="false">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden lg:inline">{userName || 'Account'}</span>
                  <ChevronDown className="w-3 h-3 hidden lg:inline" />
                </button>
                <div className="absolute top-full right-0 mt-1 bg-white border border-pcd-border rounded-xl shadow-lg z-50 min-w-[200px] hidden group-hover:block group-focus-within:block">
                  <Link href="/account" className="block px-4 py-2.5 text-sm text-pcd-text hover:bg-blue-50 hover:text-primary">My Account</Link>
                  <Link href="/account/orders" className="block px-4 py-2.5 text-sm text-pcd-text hover:bg-blue-50 hover:text-primary">My Orders</Link>
                  <Link href="/account/wallet" className="block px-4 py-2.5 text-sm text-pcd-text hover:bg-blue-50 hover:text-primary">Wallet</Link>
                  <Link href="/account/saved-keys" className="block px-4 py-2.5 text-sm text-pcd-text hover:bg-blue-50 hover:text-primary">Saved Keys</Link>
                  <hr className="border-pcd-border" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden lg:inline">Login / Register</span>
              </Link>
            )}

            <button onClick={() => setMobileMenu(true)} className="md:hidden p-1.5 sm:p-2.5 text-pcd-text">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Strip */}
      <div className="category-strip">
        <div className="max-w-7xl mx-auto">
          <div className="category-row">
            <Link href="/" className="all-btn">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </Link>
            {categories.map((cat) => (
              <div key={cat.slug} className="category-flyout">
                <Link href={`/category/${cat.slug}`} className="category-link">
                  <span className="category-link-main">
                    <Image src={cat.icon} alt="" width={24} height={24} className="w-6 h-6 object-contain" />
                    <span>{cat.name}</span>
                  </span>
                  {cat.children && <ChevronDown className="w-3 h-3 category-link-arrow" />}
                </Link>
                {cat.children && (
                  <div className="category-submenu">
                    <div className="category-submenu-head mb-3">
                      <span className="text-xs text-pcd-muted uppercase tracking-wider">Explore</span>
                      <Link href={`/category/${cat.slug}`} className="block text-sm font-bold text-primary hover:underline mt-1">{cat.name}</Link>
                    </div>
                    <div className="space-y-1">
                      {cat.children.map((child) => (
                        <Link key={child} href={`/shop?category=${child.toLowerCase().replace(/\s+/g, '-')}`} className="block px-3 py-2 text-sm text-pcd-text hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block mr-2" />
                          {child}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenu(false)} />
          <aside className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-pcd-border">
              <h5 className="font-bold text-pcd-text">Menu</h5>
              <button onClick={() => setMobileMenu(false)} className="p-2.5 text-pcd-muted hover:text-pcd-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4 pb-4 border-b border-pcd-border/50">
                {isLoggedIn ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 py-2 text-sm font-bold text-pcd-text">
                      <User className="w-4 h-4" /> {userName || 'My Account'}
                    </div>
                    <Link href="/account" className="block py-1.5 text-sm text-pcd-text hover:text-primary">My Account</Link>
                    <Link href="/account/orders" className="block py-1.5 text-sm text-pcd-text hover:text-primary">My Orders</Link>
                    <Link href="/account/wallet" className="block py-1.5 text-sm text-pcd-text hover:text-primary">Wallet</Link>
                    <Link href="/account/saved-keys" className="block py-1.5 text-sm text-pcd-text hover:text-primary">Saved Keys</Link>
                    <button onClick={handleLogout} className="block w-full text-left py-1.5 text-sm text-red-500">Logout</button>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 py-2.5 text-sm font-semibold text-primary">
                    <User className="w-4 h-4" /> Login / Register
                  </Link>
                )}
              </div>
              <h6 className="text-xs font-bold text-pcd-muted uppercase tracking-wider mb-3">Browse Categories</h6>
              <Link href="/" className="flex items-center gap-3 py-2.5 text-sm font-medium text-pcd-text">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Home
              </Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="flex items-center gap-3 py-2.5 text-sm font-medium text-pcd-text border-t border-pcd-border/50">
                  <Image src={cat.icon} alt="" width={24} height={24} className="w-6 h-6 object-contain" />
                  {cat.name}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
