'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Settings, Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import apiBase from '@/lib/api';
const UPLOAD_BASE = (apiBase as string).replace(/\/api$/, '');

export default function AdminSettings() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  async function loadSettings() {
    try {
      const data = await api.get('/admin/settings');
      setForm(data);
    } catch (e: any) { toast.error(e.message || 'Failed to load settings'); } finally { setLoading(false); }
  }

  async function handleSave() {
    try {
      for (const [key, value] of Object.entries(form)) {
        await api.put('/admin/settings', { key, value });
      }
      toast.success('All settings saved');
    } catch (e: any) { toast.error(e.message); }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const res = await fetch(`${UPLOAD_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm({ ...form, logo: data.url });
        await api.put('/admin/settings', { key: 'logo', value: data.url });
        toast.success('Logo uploaded');
      }
    } catch (e: any) { toast.error(e.message); } finally { setLogoUploading(false); }
  }

  function setVal(key: string, value: string) {
    setForm({ ...form, [key]: value });
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        Settings
      </h1>

      <div className="space-y-6">
        {/* Logo */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Logo & Branding</h3>
          <div className="flex items-center gap-4">
            {form.logo && (
              <div className="w-20 h-20 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
                <img src={form.logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-sm font-medium text-gray-600">
                <Upload className="w-4 h-4" />
                {logoUploading ? 'Uploading...' : 'Upload Logo'}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={logoUploading} />
              </label>
              <p className="text-xs text-gray-400 mt-1">Recommended: 200x50px PNG with transparency</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Logo URL (or paste image link)</label>
            <input type="text" value={form.logo || ''} onChange={e => setVal('logo', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Shop / Site Name</label>
            <input type="text" value={form.shopName || ''} onChange={e => setVal('shopName', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
          </div>
        </div>

        {/* SMTP */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">SMTP Configuration</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SMTP Host</label>
              <input type="text" value={form.smtpHost || ''} onChange={e => setVal('smtpHost', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SMTP Port</label>
              <input type="text" value={form.smtpPort || ''} onChange={e => setVal('smtpPort', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SMTP User (Email)</label>
              <input type="text" value={form.smtpUser || ''} onChange={e => setVal('smtpUser', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SMTP Password</label>
              <input type="password" value={form.smtpPass || ''} onChange={e => setVal('smtpPass', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">WhatsApp API (Gupshup)</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
              <input type="text" value={form.whatsappApiKey || ''} onChange={e => setVal('whatsappApiKey', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp Phone Number</label>
              <input type="text" value={form.whatsappPhone || ''} onChange={e => setVal('whatsappPhone', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        {/* GST */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">GST Settings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">GSTIN</label>
              <input type="text" value={form.gstin || ''} onChange={e => setVal('gstin', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">GST Percentage</label>
              <input type="text" value={form.gstPercentage || ''} onChange={e => setVal('gstPercentage', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Cashback */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Cashback Rules</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">First Order Cashback (%)</label>
              <input type="text" value={form.cashbackFirstOrder || ''} onChange={e => setVal('cashbackFirstOrder', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Max Cashback (&amp;#8377;)</label>
              <input type="text" value={form.cashbackFirstOrderMax || ''} onChange={e => setVal('cashbackFirstOrderMax', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Prepaid Discount (%)</label>
              <input type="text" value={form.cashbackPrepaid || ''} onChange={e => setVal('cashbackPrepaid', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>
    </div>
  );
}
