'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Lock, Eye, EyeOff, Mail, Phone, Smartphone, Chrome } from 'lucide-react';

type Tab = 'password' | 'email-otp' | 'phone-otp' | 'google';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('password');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email/Password
  const [emailPass, setEmailPass] = useState({ email: '', password: '' });

  // Email OTP
  const [emailOtp, setEmailOtp] = useState({ email: '', otp: '' });
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);

  // Phone OTP
  const [phoneOtp, setPhoneOtp] = useState({ phone: '', otp: '' });
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'password', label: 'Email/Password', icon: Lock },
    { id: 'phone-otp', label: 'Phone OTP', icon: Smartphone },
    { id: 'email-otp', label: 'Email OTP', icon: Mail },
    { id: 'google', label: 'Google', icon: Chrome },
  ];

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', emailPass);
      toast.success('Login successful!');
      if (res.data.user.role === 'admin') router.push('/admin');
      else router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally { setLoading(false); }
  }

  async function sendEmailOtp() {
    if (!emailOtp.email) { toast.error('Enter email'); return; }
    setLoading(true);
    try {
      await api.post('/auth/send-email-otp', { email: emailOtp.email });
      setEmailOtpSent(true);
      toast.success('OTP sent to email');
      setEmailOtpTimer(60);
      const t = setInterval(() => setEmailOtpTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  async function verifyEmailOtp() {
    if (!emailOtp.otp) { toast.error('Enter OTP'); return; }
    setLoading(true);
    try {
      await api.post('/auth/verify-email-otp', { email: emailOtp.email, otp: emailOtp.otp });
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  async function sendPhoneOtp() {
    if (!phoneOtp.phone) { toast.error('Enter phone'); return; }
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone: phoneOtp.phone });
      setPhoneOtpSent(true);
      toast.success('OTP sent to phone');
      setPhoneOtpTimer(60);
      const t = setInterval(() => setPhoneOtpTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  async function verifyPhoneOtp() {
    if (!phoneOtp.otp) { toast.error('Enter OTP'); return; }
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { phone: phoneOtp.phone, otp: phoneOtp.otp });
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  function handleGoogleLogin() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-pcd-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-pcd-text">Welcome Back</h1>
            <p className="text-sm text-pcd-muted mt-1">Sign in to your account</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${tab === t.id ? 'bg-white text-primary shadow-sm' : 'text-pcd-muted hover:text-pcd-text'}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Email/Password Tab */}
          {tab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Email Address</label>
                <input type="email" value={emailPass.email} onChange={e => setEmailPass({ ...emailPass, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                  placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={emailPass.password} onChange={e => setEmailPass({ ...emailPass, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors pr-10"
                    placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pcd-muted hover:text-pcd-text">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Phone OTP Tab */}
          {tab === 'phone-otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <input type="tel" value={phoneOtp.phone} onChange={e => setPhoneOtp({ ...phoneOtp, phone: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    placeholder="+91 9876543210" disabled={phoneOtpSent} />
                  <button onClick={sendPhoneOtp} disabled={loading || phoneOtpTimer > 0}
                    className="px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 whitespace-nowrap">
                    {phoneOtpTimer > 0 ? `${phoneOtpTimer}s` : phoneOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>
              {phoneOtpSent && (
                <div>
                  <label className="block text-xs font-medium text-pcd-muted mb-1">Enter OTP</label>
                  <input type="text" value={phoneOtp.otp} onChange={e => setPhoneOtp({ ...phoneOtp, otp: e.target.value })}
                    className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors text-center tracking-widest"
                    placeholder="· · · · · ·" maxLength={6} />
                  <button onClick={verifyPhoneOtp} disabled={loading || phoneOtp.otp.length < 6}
                    className="btn-primary w-full mt-3 disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Email OTP Tab */}
          {tab === 'email-otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Email Address</label>
                <div className="flex gap-2">
                  <input type="email" value={emailOtp.email} onChange={e => setEmailOtp({ ...emailOtp, email: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    placeholder="you@example.com" disabled={emailOtpSent} />
                  <button onClick={sendEmailOtp} disabled={loading || emailOtpTimer > 0}
                    className="px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 whitespace-nowrap">
                    {emailOtpTimer > 0 ? `${emailOtpTimer}s` : emailOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>
              {emailOtpSent && (
                <div>
                  <label className="block text-xs font-medium text-pcd-muted mb-1">Enter OTP</label>
                  <input type="text" value={emailOtp.otp} onChange={e => setEmailOtp({ ...emailOtp, otp: e.target.value })}
                    className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors text-center tracking-widest"
                    placeholder="· · · · · ·" maxLength={6} />
                  <button onClick={verifyEmailOtp} disabled={loading || emailOtp.otp.length < 6}
                    className="btn-primary w-full mt-3 disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Google Tab */}
          {tab === 'google' && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-pcd-muted">Sign in with your Google account</p>
              <button onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm">
                <Chrome className="w-5 h-5 text-blue-500" />
                Continue with Google
              </button>
            </div>
          )}

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-pcd-muted">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">Register</Link>
            </p>
            <Link href="/forgot-password" className="block text-xs text-pcd-muted hover:text-primary transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
