'use client';

import Link from 'next/link';
import { User, Package, Wallet, Download, Key, ChevronRight } from 'lucide-react';

export default function AccountPage() {
  const user = { name: 'Guest User', email: 'guest@example.com', phone: '+91 9999999999', walletBalance: 0 };

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/account/orders', desc: 'View order history & download keys' },
    { icon: Wallet, label: 'Wallet', href: '/account/wallet', desc: 'Check cashback balance & transactions' },
    { icon: Download, label: 'Invoices', href: '/account/invoices', desc: 'Download GST invoices' },
    { icon: Key, label: 'Saved Keys', href: '/account/saved-keys', desc: 'View your purchased license keys' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white border border-pcd-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-2xl">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-pcd-text">{user.name}</h1>
            <p className="text-sm text-pcd-muted">{user.email}</p>
            <p className="text-sm text-pcd-muted">{user.phone}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-pcd-muted">Wallet Balance</p>
            <p className="text-2xl font-extrabold text-primary">₹{user.walletBalance || 0}</p>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="bg-white border border-pcd-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-pcd-text group-hover:text-primary transition-colors">{item.label}</h3>
                    <p className="text-xs text-pcd-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-pcd-muted group-hover:text-primary transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Back to Home */}
      <Link href="/"
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Home
      </Link>
    </div>
  );
}
