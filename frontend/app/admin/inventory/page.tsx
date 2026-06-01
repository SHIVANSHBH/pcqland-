'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Box, Upload, AlertTriangle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import apiBase from '@/lib/api';
const UPLOAD_BASE = (apiBase as string).replace(/\/api$/, '');

export default function AdminInventory() {
  const [stats, setStats] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [s, p] = await Promise.all([
        api.get('/admin/inventory/stats'),
        api.get('/admin/products'),
      ]);
      setStats(s);
      setProducts(p);
    } catch (e: any) { toast.error(e.message || 'Failed to load inventory'); } finally { setLoading(false); }
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file || !selectedProduct) { toast.error('Select product and file'); return; }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', selectedProduct);
      const token = localStorage.getItem('token');
      const res = await fetch(`${UPLOAD_BASE}/api/admin/inventory/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      toast.success(data.message || 'Keys uploaded');
      setShowUpload(false);
      loadData();
    } catch (e: any) { toast.error(e.message); }
  }

  const filtered = stats.filter((p: any) =>
    (p.productName || '').toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = stats.filter((s: any) => (s.total - s.used) < 10);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <Box className="w-6 h-6 text-primary" />
          Inventory Manager
        </h1>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
          <Upload className="w-4 h-4" /> Upload CSV
        </button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Low Stock Alert</p>
            {lowStock.map((s: any) => (
              <p key={s._id} className="text-xs text-amber-700">{s.productName}: only {(s.total - s.used)} keys available</p>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-semibold text-gray-500">Product</th>
                <th className="text-left py-3 font-semibold text-gray-500">Total Keys</th>
                <th className="text-left py-3 font-semibold text-gray-500">Used</th>
                <th className="text-left py-3 font-semibold text-gray-500">Available</th>
                <th className="text-left py-3 font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => {
                const available = item.total - item.used;
                return (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 font-semibold text-gray-800">{item.productName}</td>
                    <td className="py-3">{item.total}</td>
                    <td className="py-3">{item.used}</td>
                    <td className="py-3">{available}</td>
                    <td className="py-3">
                      {available < 10 ? (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-600">Low Stock</span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600">In Stock</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">No inventory data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Upload CSV Keys</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
                <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary">
                  <option value="">Select product</option>
                  {products.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">CSV File (columns: key, validity)</label>
                <input ref={fileRef} type="file" accept=".csv" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button onClick={handleUpload} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark">Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
