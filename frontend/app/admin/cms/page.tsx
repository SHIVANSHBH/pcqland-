'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FileText, Plus, Edit2, Trash2, Image, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'banners', label: 'Banners' },
  { id: 'usps', label: 'USP Features' },
];

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState('testimonials');
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [usps, setUsps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [t, f, b, u] = await Promise.all([
        api.get('/admin/testimonials').catch(() => []),
        api.get('/admin/faqs').catch(() => []),
        api.get('/admin/banners').catch(() => []),
        api.get('/admin/usps').catch(() => []),
      ]);
      setTestimonials(Array.isArray(t) ? t : []);
      setFaqs(Array.isArray(f) ? f : []);
      setBanners(Array.isArray(b) ? b : []);
      setUsps(Array.isArray(u) ? u : []);
    } catch (e: any) { toast.error(e.message || 'Failed to load CMS data'); } finally { setLoading(false); }
  }

  function openCreate() {
    setEditItem(null);
    setShowModal(true);
  }

  function openEdit(item: any) {
    setEditItem(item);
    setShowModal(true);
  }

  async function handleDelete(type: string, id: string) {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      toast.success('Deleted');
      loadAll();
    } catch (e: any) { toast.error(e.message); }
  }

  function renderField(field: string, label: string, type = 'text') {
    const val = editItem?.[field] || '';
    return (
      <div key={field}>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        {type === 'textarea' ? (
          <textarea value={val} onChange={e => setEditItem({ ...editItem, [field]: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
        ) : type === 'number' ? (
          <input type="number" value={val} onChange={e => setEditItem({ ...editItem, [field]: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
        ) : (
          <input type="text" value={val} onChange={e => setEditItem({ ...editItem, [field]: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
        )}
      </div>
    );
  }

  async function handleSave() {
    try {
      const type = activeTab === 'testimonials' ? 'testimonials' : activeTab === 'faqs' ? 'faqs' : activeTab === 'banners' ? 'banners' : 'usps';
      if (editItem?._id) {
        await api.put(`/admin/${type}/${editItem._id}`, editItem);
        toast.success('Updated');
      } else {
        await api.post(`/admin/${type}`, editItem || {});
        toast.success('Created');
      }
      setShowModal(false);
      loadAll();
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        Content Management
      </h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Testimonials */}
      {activeTab === 'testimonials' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Testimonials</h3>
            <button onClick={() => { setEditItem({ name: '', location: '', text: '', rating: 5, displayOrder: 0 }); setShowModal(true); }} className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
          <div className="space-y-3">
            {testimonials.map((t: any) => (
              <div key={t._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location} {'★'.repeat(t.rating || 5)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.text}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete('testimonials', t._id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No testimonials yet</p>}
          </div>
        </div>
      )}

      {/* FAQs */}
      {activeTab === 'faqs' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">FAQs</h3>
            <button onClick={() => { setEditItem({ question: '', answer: '', displayOrder: 0 }); setShowModal(true); }} className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
          <div className="space-y-2">
            {faqs.map((faq: any) => (
              <div key={faq._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{faq.question || faq.q}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{faq.answer || faq.a}</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <button onClick={() => openEdit(faq)} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete('faqs', faq._id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {faqs.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No FAQs yet</p>}
          </div>
        </div>
      )}

      {/* Banners */}
      {activeTab === 'banners' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Banners</h3>
            <button onClick={() => { setEditItem({ title: '', subtitle: '', image: '', link: '', isActive: true, displayOrder: 0 }); setShowModal(true); }} className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
              <Image className="w-4 h-4" /> Add Banner
            </button>
          </div>
          {banners.map((b: any) => (
            <div key={b._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div className="flex items-center gap-3">
                {b.image && <img src={b.image} className="w-16 h-10 rounded object-cover" />}
                <div>
                  <p className="text-sm font-semibold text-gray-800">{b.title}</p>
                  <p className="text-xs text-gray-400">{b.subtitle}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(b)} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete('banners', b._id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No banners yet. Recommended size: 1920x500px.</p>}
        </div>
      )}

      {/* USPs */}
      {activeTab === 'usps' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">USP Features</h3>
            <button onClick={() => { setEditItem({ title: '', description: '', icon: 'zap', displayOrder: 0, isActive: true }); setShowModal(true); }} className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
          {usps.map((u: any) => (
            <div key={u._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{u.title}</p>
                <p className="text-xs text-gray-400">{u.description}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(u)} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete('usps', u._id)} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {usps.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No USP features yet</p>}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{editItem?._id ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {activeTab === 'testimonials' && (
                <div className="grid grid-cols-2 gap-4">
                  {renderField('name', 'Name')}
                  {renderField('location', 'Location')}
                  {renderField('text', 'Content', 'textarea')}
                  {renderField('rating', 'Rating', 'number')}
                  {renderField('displayOrder', 'Display Order', 'number')}
                </div>
              )}
              {activeTab === 'faqs' && (
                <div className="space-y-4">
                  {renderField('question', 'Question', 'textarea')}
                  {renderField('answer', 'Answer', 'textarea')}
                  {renderField('displayOrder', 'Display Order', 'number')}
                </div>
              )}
              {activeTab === 'banners' && (
                <div className="space-y-4">
                  {renderField('title', 'Title')}
                  {renderField('subtitle', 'Subtitle')}
                  {renderField('link', 'Link URL')}
                  {renderField('image', 'Image URL')}
                  {renderField('displayOrder', 'Display Order', 'number')}
                </div>
              )}
              {activeTab === 'usps' && (
                <div className="space-y-4">
                  {renderField('title', 'Title')}
                  {renderField('description', 'Description', 'textarea')}
                  {renderField('icon', 'Icon Name')}
                  {renderField('displayOrder', 'Display Order', 'number')}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark">
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
