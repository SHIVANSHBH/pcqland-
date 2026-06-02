'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, ChevronRight, Download, Eye } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { OrderCardSkeleton } from '@/components/Skeleton';

const sampleOrders = [
  { orderId: 'PCD202605201234', date: '2026-05-20', amount: 3998, status: 'completed', items: [{ name: 'Windows 11 Pro', qty: 1, price: 1499 }, { name: 'Microsoft Office 2021 Pro Plus', qty: 1, price: 2499 }], keys: ['WXXX-XXXXX-XXXXX-XXXXX', 'OXXX-XXXXX-XXXXX-XXXXX'] },
  { orderId: 'PCD202605151234', date: '2026-05-15', amount: 599, status: 'completed', items: [{ name: 'Kaspersky Internet Security 1Y-1PC', qty: 1, price: 599 }], keys: ['KXXX-XXXXX-XXXXX-XXXXX'] },
];

export default function OrdersPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 5;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-pcd-muted mb-6">
        <Link href="/account" className="hover:text-primary">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-pcd-text font-semibold">My Orders</span>
      </div>

      <h1 className="text-xl font-extrabold text-pcd-text mb-6 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        My Orders
      </h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : sampleOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-pcd-muted mx-auto mb-3" />
          <p className="text-sm text-pcd-muted">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sampleOrders.slice((page - 1) * perPage, page * perPage).map((order) => (
            <div key={order.orderId} className="bg-white border border-pcd-border rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(expanded === order.orderId ? null : order.orderId)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="text-left">
                  <p className="text-sm font-bold text-pcd-text">{order.orderId}</p>
                  <p className="text-xs text-pcd-muted">{formatDate(order.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.amount)}</p>
                  <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">{order.status}</span>
                </div>
              </button>

              {expanded === order.orderId && (
                <div className="border-t border-pcd-border p-4">
                  <h4 className="text-xs font-bold text-pcd-muted uppercase mb-3">Products</h4>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-pcd-text">{item.name} x{item.qty}</span>
                      <span className="font-semibold">{formatPrice(item.price)}</span>
                    </div>
                  ))}

                  <h4 className="text-xs font-bold text-pcd-muted uppercase mt-4 mb-2">License Keys</h4>
                  <div className="space-y-1">
                    {order.keys.map((key, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <code className="text-sm font-mono text-primary">{key}</code>
                        <button onClick={() => navigator.clipboard.writeText(key)} className="text-xs text-pcd-muted hover:text-primary transition-colors">Copy</button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button className="text-xs flex items-center gap-1 text-primary font-semibold hover:underline">
                      <Download className="w-3 h-3" /> Download Invoice
                    </button>
                    <button className="text-xs flex items-center gap-1 text-emerald-600 font-semibold hover:underline">
                      <Eye className="w-3 h-3" /> View Key
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {sampleOrders.length > perPage && <Pagination page={page} totalPages={Math.ceil(sampleOrders.length / perPage)} onPageChange={setPage} />}
    </div>
  );
}
