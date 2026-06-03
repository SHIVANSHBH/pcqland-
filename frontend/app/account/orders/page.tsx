'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package, ChevronRight, Download, Eye } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { OrderCardSkeleton } from '@/components/Skeleton';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 5;

  useEffect(() => {
    api.get('/orders/my-orders').then(d => {
      const items = d.data || [];
      setOrders(items);
      setTotal(items.length);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

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
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-pcd-muted mx-auto mb-3" />
          <p className="text-sm text-pcd-muted">No orders yet</p>
          <Link href="/" className="btn-primary inline-flex mt-4">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.slice((page - 1) * perPage, page * perPage).map((order) => (
            <div key={order.orderId || order._id} className="bg-white border border-pcd-border rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(expanded === (order.orderId || order._id) ? null : (order.orderId || order._id))} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="text-left">
                  <p className="text-sm font-bold text-pcd-text">{order.orderId}</p>
                  <p className="text-xs text-pcd-muted">{formatDate(order.createdAt || order.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.amount)}</p>
                  <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">{order.paymentStatus || order.status}</span>
                </div>
              </button>

              {expanded === (order.orderId || order._id) && (
                <div className="border-t border-pcd-border p-4">
                  <h4 className="text-xs font-bold text-pcd-muted uppercase mb-3">Products</h4>
                  {(order.items || []).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-pcd-text">{item.productName || item.name} x{item.quantity || item.qty}</span>
                      <span className="font-semibold">{formatPrice(item.totalPrice || item.price)}</span>
                    </div>
                  ))}

                  <h4 className="text-xs font-bold text-pcd-muted uppercase mt-4 mb-2">License Keys</h4>
                  <div className="space-y-1">
                    {(order.deliveredKeys || order.keys || []).length === 0 ? (
                      <p className="text-xs text-pcd-muted">Keys will be delivered after payment confirmation.</p>
                    ) : (order.deliveredKeys || order.keys || []).map((key: string, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 gap-2">
                        <code className="text-xs sm:text-sm font-mono text-primary truncate min-w-0">{key}</code>
                        <button onClick={() => { navigator.clipboard.writeText(key); }} className="text-xs text-pcd-muted hover:text-primary transition-colors flex-shrink-0 px-2 py-1.5">Copy</button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    {order.invoiceUrl && (
                      <a href={order.invoiceUrl} className="text-xs flex items-center gap-1 text-primary font-semibold hover:underline px-2 py-1.5 rounded-lg hover:bg-blue-50">
                        <Download className="w-3 h-3" /> Download Invoice
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {total > perPage && <Pagination page={page} totalPages={Math.ceil(total / perPage)} onPageChange={setPage} />}
    </div>
  );
}
