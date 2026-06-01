'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Users, Search, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [walletModal, setWalletModal] = useState<any>(null);
  const [walletAmount, setWalletAmount] = useState(0);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    try {
      const data = await api.get('/admin/users');
      setUsers(data);
    } catch (e: any) { toast.error(e.message || 'Failed to load users'); } finally { setLoading(false); }
  }

  async function adjustWallet() {
    try {
      await api.put(`/admin/users/${walletModal._id}/wallet`, { amount: walletAmount });
      toast.success('Wallet adjusted');
      setWalletModal(null);
      loadUsers();
    } catch (e: any) { toast.error(e.message); }
  }

  const filtered = users.filter((u: any) =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" />
        Users
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-semibold text-gray-500">Name</th>
                <th className="text-left py-3 font-semibold text-gray-500">Email</th>
                <th className="text-left py-3 font-semibold text-gray-500">Phone</th>
                <th className="text-left py-3 font-semibold text-gray-500">Wallet</th>
                <th className="text-left py-3 font-semibold text-gray-500">Joined</th>
                <th className="text-right py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user: any) => (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-semibold text-gray-800">{user.name}</td>
                  <td className="py-3 text-gray-500">{user.email}</td>
                  <td className="py-3 text-gray-500">{user.phone || 'N/A'}</td>
                  <td className="py-3">
                    <span className="font-semibold text-primary">₹{(user.walletBalance || 0).toLocaleString()}</span>
                  </td>
                  <td className="py-3 text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-3 text-right">
                    <button onClick={() => { setWalletModal(user); setWalletAmount(0); }} className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline ml-auto">
                      <Wallet className="w-3 h-3" /> Adjust Wallet
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={6} className="py-6 text-center text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Modal */}
      {walletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setWalletModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Adjust Wallet</h3>
            <p className="text-sm text-gray-500 mb-4">{walletModal.name} - Current: ₹{walletModal.walletBalance || 0}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Amount (+/-)</label>
                <input type="number" value={walletAmount} onChange={e => setWalletAmount(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setWalletModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={adjustWallet} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
