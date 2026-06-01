'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-pcd-text mb-6">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white border border-pcd-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-pcd-text mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-pcd-text">Phone</p>
                  <p className="text-sm text-pcd-muted">Technical Help: 98445-39000</p>
                  <p className="text-sm text-pcd-muted">Sales: 97286-22667</p>
                  <p className="text-xs text-pcd-muted">Mon - Sat, 11 AM - 7 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-pcd-text">Email</p>
                  <p className="text-sm text-pcd-muted">info@pcdealsindia.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-pcd-text">Address</p>
                  <p className="text-sm text-pcd-muted">Shree Hira Computer & Communication, Surat, Gujarat, India</p>
                </div>
              </div>
            </div>
          </div>

          <a href="https://wa.me/919728622667?text=Hi%2C%20I%20need%20help%20with%20PC%20Deals%20India." target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-pcd-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-pcd-text mb-4">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-pcd-muted mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-pcd-muted mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-pcd-muted mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-pcd-muted mb-1">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" rows={4} required />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
