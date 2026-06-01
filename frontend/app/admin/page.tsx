'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TrendingUp, DollarSign, Key, ShoppingCart, Users, Wallet } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [dashData, orderData] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/orders?limit=5'),
        ]);
        setStats(dashData);
        setOrders(orderData.orders || []);
      } catch {}
    }
    load();
  }, []);

  const statCards = stats ? [
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, change: 'All time', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Orders Today', value: String(stats.ordersToday || 0), icon: ShoppingCart, change: 'Today', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: String(stats.totalOrders || 0), icon: TrendingUp, change: 'All orders', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Keys', value: String(stats.pendingKeys || 0), icon: Key, change: 'Available in inventory', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Users', value: String(stats.usersCount || 0), icon: Users, change: 'Registered users', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Wallet Liability', value: `₹${(stats.walletLiability || 0).toLocaleString()}`, icon: Wallet, change: 'Unused cashback', color: 'text-rose-600', bg: 'bg-rose-50' },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">{stat.label}</span>
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl font-extrabold text-gray-800">{stat.value}</p>
              <p className={`text-xs font-medium mt-1 ${stat.color}`}>{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800">Recent Orders</h2>
          <span className="text-xs text-gray-500">Last 5 orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-semibold text-gray-500">Order ID</th>
                <th className="text-left py-3 font-semibold text-gray-500">Customer</th>
                <th className="text-left py-3 font-semibold text-gray-500">Amount</th>
                <th className="text-left py-3 font-semibold text-gray-500">Status</th>
                <th className="text-left py-3 font-semibold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-mono text-xs text-gray-600">{(order.orderId || order._id || '').toString().slice(-12)}</td>
                  <td className="py-3 font-medium text-gray-800">{order.user?.name || order.email || 'N/A'}</td>
                  <td className="py-3 font-semibold">₹{(order.amount || 0).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      order.orderStatus === 'completed' ? 'bg-green-50 text-green-600' : order.paymentStatus === 'paid' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.orderStatus || order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
