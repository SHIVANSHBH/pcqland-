'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordMatch = form.password === form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!passwordMatch) { toast.error('Passwords do not match'); setLoading(false); return; }
      const { confirmPassword, ...registerData } = form;
      const res = await api.post('/auth/register', registerData);
      const data = res.data;
      toast.success('Registration successful!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-pcd-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-pcd-text">Create Account</h1>
            <p className="text-sm text-pcd-muted mt-1">Join PC Deals India today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-pcd-muted mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" placeholder="Your Name" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-pcd-muted mb-1">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-pcd-muted mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" placeholder="+91 9876543210" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-pcd-muted mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors pr-10" placeholder="Min. 6 characters" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-pcd-muted hover:text-pcd-text">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-pcd-muted mb-1">Confirm Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors pr-10" placeholder="Re-enter password" required minLength={6} />
              </div>
              {!passwordMatch && form.confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
            </div>
            <button type="submit" disabled={loading || !!(!passwordMatch && form.confirmPassword)} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-pcd-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
