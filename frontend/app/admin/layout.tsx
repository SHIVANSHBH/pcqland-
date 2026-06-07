'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, LayoutGrid, Box, ShoppingCart, Users, FileText, Settings, LogOut, Menu, X } from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: LayoutGrid, label: 'Categories', href: '/admin/categories' },
  { icon: Box, label: 'Inventory', href: '/admin/inventory' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: FileText, label: 'CMS', href: '/admin/cms' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (!d.success || d.data?.role !== 'admin') { router.push('/login'); } else { setChecking(false); } })
      .catch(() => router.push('/login'));
  }, [router]);

  if (checking) return <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">Checking access...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2.5 text-gray-600">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-primary">PC Deals Admin</span>
        <Link href="/" className="p-2.5 text-gray-600">
          <LogOut className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex">
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Link href="/admin" className="text-lg font-extrabold text-primary">PC Deals Admin</Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-3 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            <hr className="my-3 border-gray-200" />
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors w-full">
              <LogOut className="w-5 h-5" />
              Back to Home
            </Link>
          </nav>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
