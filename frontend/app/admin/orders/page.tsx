'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ShoppingCart, Search, RefreshCw, RotateCcw } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    try {
      const data = await api.get('/admin/orders');
      setOrders(data.orders || []);
    } catch (e: any) { toast.error(e.message || 'Failed to load orders'); } finally { setLoading(false); }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.put(`/admin/orders/${id}/status`, { orderStatus: status });
      toast.success('Status updated');
      loadOrders();
    } catch (e: any) { toast.error(e.message); }
  }

  async function resendKeys(id: string) {
    try {
      await api.post(`/admin/orders/${id}/resend`, {});
      toast.success('Keys resent');
    } catch (e: any) { toast.error(e.message); }
  }

  async function refundOrder(id: string) {
    if (!confirm('Refund this order?')) return;
    try {
      await api.post(`/admin/orders/${id}/refund`, {});
      toast.success('Order refunded');
      loadOrders();
    } catch (e: any) { toast.error(e.message); }
  }

  const filtered = orders.filter((o: any) =>
    (o.orderId || o._id || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.name || o.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-primary" />
        Orders Manager
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by order ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-semibold text-gray-500">Order ID</th>
                <th className="text-left py-3 font-semibold text-gray-500">Customer</th>
                <th className="text-left py-3 font-semibold text-gray-500">Amount</th>
                <th className="text-left py-3 font-semibold text-gray-500">Payment</th>
                <th className="text-left py-3 font-semibold text-gray-500">Status</th>
                <th className="text-left py-3 font-semibold text-gray-500">Date</th>
                <th className="text-right py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <TableSkeleton rows={5} cols={7} /> : filtered.map((order: any) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-mono text-xs text-gray-600">{(order.orderId || order._id || '').toString().slice(-14)}</td>
                  <td className="py-3 font-medium text-gray-800">{order.user?.name || order.email || 'N/A'}</td>
                  <td className="py-3 font-semibold">₹{(order.amount || 0).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                      {order.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td className="py-3">
                    <select value={order.orderStatus || 'pending'} onChange={e => updateStatus(order._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${order.orderStatus === 'completed' ? 'bg-green-50 text-green-600' : order.orderStatus === 'paid' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => resendKeys(order._id)} className="p-1.5 text-gray-400 hover:text-blue-600" title="Resend Key"><RefreshCw className="w-4 h-4" /></button>
                    <button onClick={() => refundOrder(order._id)} className="p-1.5 text-gray-400 hover:text-red-600" title="Refund"><RotateCcw className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={7} className="py-6 text-center text-gray-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
