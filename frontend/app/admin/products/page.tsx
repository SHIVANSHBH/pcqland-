'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Image from 'next/image';
import { Package, Plus, Edit2, Trash2, Search, X, Check, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import apiBase from '@/lib/api';
import { TableSkeleton } from '@/components/ui/Skeleton';
const UPLOAD_BASE = (apiBase as string).replace(/\/api$/, '');

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string | { _id: string; name: string };
  price: number;
  mrp: number;
  images: string[];
  validity: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [form, setForm] = useState<any>({
    name: '', slug: '', description: '', shortDescription: '', category: '', price: 0, mrp: 0,
    images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: [],
  });
  const [uploading, setUploading] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [prods, cats] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/categories'),
      ]);
      setProducts(prods.products || prods);
      setCategories(cats);
    } catch (e: any) { toast.error(e.message || 'Failed to load data'); } finally { setLoading(false); }
  }

  function openCreate() {
    setEditProd(null);
    setForm({ name: '', slug: '', description: '', shortDescription: '', category: categories[0]?._id || '', price: 0, mrp: 0, images: [], validity: 'Lifetime', isActive: true, isFeatured: false, tags: [] });
    setShowModal(true);
  }

  function openEdit(prod: Product) {
    setEditProd(prod);
    setForm({
      name: prod.name, slug: prod.slug, description: prod.description || '', shortDescription: prod.shortDescription || '',
      category: typeof prod.category === 'object' ? prod.category._id : (prod.category || ''),
      price: prod.price, mrp: prod.mrp, images: prod.images || [], validity: prod.validity || 'Lifetime',
      isActive: prod.isActive, isFeatured: prod.isFeatured, tags: prod.tags || [],
    });
    setShowModal(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${UPLOAD_BASE}/api/admin/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm({ ...form, images: [...form.images, data.url] });
        toast.success('Image uploaded');
      }
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  }

  function removeImage(idx: number) {
    setForm({ ...form, images: form.images.filter((_: any, i: number) => i !== idx) });
  }

  const assetFiles: string[] = [
    '1565303531.shree hira computer Logo for WebSite.png',
    '1622030502.baner02.jpg', '1622030789.baner01.jpg',
    '1748147923.1746162050.Anti Fraud.jpg',
    '1748197776.1714020604.pcdeals-banner-1.jpg',
    '1776757549.k7-removebg-preview.png',
    '1776830389.microsoft-office-2019.png',
    '1776830587.MS win.png', '1776831162.ms project.png',
    '1776831414.ms visio icon.png',
    '1776831481.Visual_Studio_Icon_2026.svg.png',
    '1776831729.Quick Heal Icon.png', '1776832684.np av.jpg',
    '1776920398.Guardian new 2.png',
    '1776920500.Kaspersky ICON.png', '1776920604.ESET.jpg',
    '1776923944.mcafee icon.png', '1777111497.MS win.png',
    '1777112945.MS win.png', 'payment-2.png', 'payment-3.png',
    'payment-4.png', 'qr.jpg',
  ];

  async function handleSave() {
    try {
      if (editProd) {
        await api.put(`/admin/products/${editProd._id}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', form);
        toast.success('Product created');
      }
      setShowModal(false);
      loadData();
    } catch (e: any) { toast.error(e.message); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      loadData();
    } catch (e: any) { toast.error(e.message); }
  }

  function getCategoryName(cat: any) {
    if (!cat) return 'N/A';
    return typeof cat === 'object' ? cat.name : categories.find(c => c._id === cat)?.name || cat;
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          Products
        </h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-semibold text-gray-500">Product</th>
                <th className="text-left py-3 font-semibold text-gray-500">Category</th>
                <th className="text-left py-3 font-semibold text-gray-500">Price</th>
                <th className="text-left py-3 font-semibold text-gray-500">MRP</th>
                <th className="text-left py-3 font-semibold text-gray-500">Status</th>
                <th className="text-right py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <TableSkeleton rows={5} cols={6} /> : filtered.map((prod) => (
                <tr key={prod._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-semibold text-gray-800">{prod.name}</td>
                  <td className="py-3 text-gray-500">{getCategoryName(prod.category)}</td>
                  <td className="py-3">₹{prod.price}</td>
                  <td className="py-3 text-gray-400 line-through">₹{prod.mrp}</td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${prod.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {prod.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => openEdit(prod)} className="p-2 text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(prod._id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={6} className="py-6 text-center text-gray-400">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{editProd ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
                  <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Short Description</label>
                <input type="text" value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary">
                    <option value="">Select category</option>
                    {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Validity</label>
                  <input type="text" value={form.validity} onChange={e => setForm({ ...form, validity: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">MRP (₹)</label>
                  <input type="number" value={form.mrp} onChange={e => setForm({ ...form, mrp: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma separated)</label>
                <input type="text" value={form.tags.join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((url: string, i: number) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={url} alt="" fill className="object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-bl-lg flex items-center justify-center"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  <button onClick={() => setShowAssetPicker(true)} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
                    <ImageIcon className="w-4 h-4" /> From Assets
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark">
                <Check className="w-4 h-4" /> {editProd ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Picker */}
      {showAssetPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-8" onClick={() => setShowAssetPicker(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Select Asset Image</h3>
              <button onClick={() => setShowAssetPicker(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto">
              {assetFiles.map((file) => (
                <button key={file} onClick={() => { setForm({ ...form, images: [...form.images, `/assets/${file}`] }); setShowAssetPicker(false); }}
                  className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden hover:border-primary hover:shadow-md transition-all p-1">
                  <Image src={`/assets/${file}`} alt={file} fill className="object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
