'use client';

import Link from 'next/link';
import { ChevronRight, Key, Copy, Eye } from 'lucide-react';

const savedKeys = [
  { orderId: 'PCD202605201234', product: 'Windows 11 Pro', key: 'WXXX-XXXXX-XXXXX-XXXXX', date: 'May 20, 2026' },
  { orderId: 'PCD202605201234', product: 'Microsoft Office 2021 Pro Plus', key: 'OXXX-XXXXX-XXXXX-XXXXX', date: 'May 20, 2026' },
  { orderId: 'PCD202605151234', product: 'Kaspersky Internet Security 1Y-1PC', key: 'KXXX-XXXXX-XXXXX-XXXXX', date: 'May 15, 2026' },
];

export default function SavedKeysPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-pcd-muted mb-6">
        <Link href="/account" className="hover:text-primary">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-pcd-text font-semibold">Saved Keys</span>
      </div>

      <h1 className="text-xl font-extrabold text-pcd-text mb-6 flex items-center gap-2">
        <Key className="w-5 h-5 text-primary" />
        My License Keys
      </h1>

      <div className="space-y-3">
        {savedKeys.map((item, i) => (
          <div key={i} className="bg-white border border-pcd-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-pcd-text">{item.product}</p>
                <p className="text-xs text-pcd-muted">{item.orderId} • {item.date}</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
              <code className="text-sm font-mono text-primary font-bold">{item.key}</code>
              <div className="flex items-center gap-2">
                <button onClick={() => navigator.clipboard.writeText(item.key)} className="p-1.5 text-pcd-muted hover:text-primary transition-colors" title="Copy">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-pcd-muted hover:text-primary transition-colors" title="View">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
