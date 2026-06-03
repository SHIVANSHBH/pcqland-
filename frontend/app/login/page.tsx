'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { setAccessToken } from '@/lib/api';
import { Lock, Eye, EyeOff, Mail, Smartphone, Shield, History, Wallet, Headphones, Zap, CheckCircle } from 'lucide-react';

type Tab = 'password' | 'phone-otp' | 'email-otp';

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

  const features = [
    { icon: Shield, title: 'Secure Login', desc: 'Your account is fully encrypted & protected' },
    { icon: History, title: 'Order History', desc: 'Track all your orders in one place' },
    { icon: Wallet, title: 'Wallet & Cashback', desc: 'Manage your balance and save more' },
    { icon: Headphones, title: 'Technical Support', desc: "We're always here to help you" },
  ];

  const stats = [
    { count: '20000+', label: 'Happy Customers' },
    { count: '1 Sec', label: 'WhatsApp and Email Delivery' },
    { count: '24 Hrs', label: 'GST Invoice' },
  ];

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', emailPass);
      setAccessToken(res.data.accessToken);
      try { sessionStorage.removeItem('_auth_me'); sessionStorage.removeItem('_settings'); } catch {}
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
      const res2 = await api.post('/auth/verify-email-otp', { email: emailOtp.email, otp: emailOtp.otp });
      setAccessToken(res2.data.accessToken);
      try { sessionStorage.removeItem('_auth_me'); sessionStorage.removeItem('_settings'); } catch {}
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  async function sendPhoneOtp() {
    if (!phoneOtp.phone) { toast.error('Enter phone'); return; }
    setLoading(true);
    try {
      const cleanPhone = phoneOtp.phone.replace(/\D/g, '');
      await api.post('/auth/send-otp', { phone: cleanPhone });
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
      const cleanPhone = phoneOtp.phone.replace(/\D/g, '');
      const res3 = await api.post('/auth/verify-otp', { phone: cleanPhone, otp: phoneOtp.otp });
      setAccessToken(res3.data.accessToken);
      try { sessionStorage.removeItem('_auth_me'); sessionStorage.removeItem('_settings'); } catch {}
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero + Form Section */}
      <section className="px-4 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">

            {/* Left - Brand */}
            <div className="space-y-8 pt-6">
              <div>
                <Link href="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-full hover:bg-blue-100 transition-colors">
                  Don&apos;t Have an Account? <span className="underline font-bold">Sign Up Free</span>
                </Link>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  Access Your
                  <br />
                  Account <span className="text-blue-600">Instantly</span> <span className="text-4xl">🔓</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-md">
                  Manage orders, track deliveries & save time
                </p>
              </div>

              <div className="space-y-5">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{f.title}</h4>
                        <p className="text-sm text-gray-500">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - Login Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">Login to Your Account</h2>
                <p className="text-sm text-gray-500 mt-1">Sign in to PC Deals India & manage your business</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 mb-6 bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setTab('password')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-semibold rounded-lg transition-all min-w-0 ${tab === 'password' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Login with Email & Password</span>
                  <span className="sm:hidden">Email</span>
                </button>
                <button onClick={() => setTab('phone-otp')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-semibold rounded-lg transition-all min-w-0 ${tab === 'phone-otp' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                  <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Login with Mobile (OTP)</span>
                  <span className="sm:hidden">Mobile</span>
                </button>
                <button onClick={() => setTab('email-otp')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-semibold rounded-lg transition-all min-w-0 ${tab === 'email-otp' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Login with Email (OTP)</span>
                  <span className="sm:hidden">Email OTP</span>
                </button>
              </div>

              {/* Email/Password Tab */}
              {tab === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" value={emailPass.email} onChange={e => setEmailPass({ ...emailPass, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Enter your email address" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={emailPass.password} onChange={e => setEmailPass({ ...emailPass, password: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-11"
                        placeholder="Enter your password" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                    {loading ? 'Signing in...' : 'Login Now'}
                  </button>
                  <div className="text-center">
                    <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
                      Forgot Your Password?
                    </Link>
                  </div>
                </form>
              )}

              {/* Phone OTP Tab */}
              {tab === 'phone-otp' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input type="tel" value={phoneOtp.phone} onChange={e => setPhoneOtp({ ...phoneOtp, phone: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="+91 9876543210" disabled={phoneOtpSent} />
                      <button onClick={sendPhoneOtp} disabled={loading || phoneOtpTimer > 0}
                        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all whitespace-nowrap shadow-lg shadow-blue-200">
                        {phoneOtpTimer > 0 ? `${phoneOtpTimer}s` : phoneOtpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                  {phoneOtpSent && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Enter OTP <span className="text-red-500">*</span></label>
                        <input type="text" value={phoneOtp.otp} onChange={e => setPhoneOtp({ ...phoneOtp, otp: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center tracking-[0.5em] font-bold"
                          placeholder="· · · · · ·" maxLength={6} />
                      </div>
                      <button onClick={verifyPhoneOtp} disabled={loading || phoneOtp.otp.length < 6}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                        {loading ? 'Verifying...' : 'Verify & Login'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Email OTP Tab */}
              {tab === 'email-otp' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input type="email" value={emailOtp.email} onChange={e => setEmailOtp({ ...emailOtp, email: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Enter your email address" disabled={emailOtpSent} />
                      <button onClick={sendEmailOtp} disabled={loading || emailOtpTimer > 0}
                        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all whitespace-nowrap shadow-lg shadow-blue-200">
                        {emailOtpTimer > 0 ? `${emailOtpTimer}s` : emailOtpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                  {emailOtpSent && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Enter OTP <span className="text-red-500">*</span></label>
                        <input type="text" value={emailOtp.otp} onChange={e => setEmailOtp({ ...emailOtp, otp: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center tracking-[0.5em] font-bold"
                          placeholder="· · · · · ·" maxLength={6} />
                      </div>
                      <button onClick={verifyEmailOtp} disabled={loading || emailOtp.otp.length < 6}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                        {loading ? 'Verifying...' : 'Verify & Login'}
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-blue-600">{s.count}</div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Shield, title: 'Secure Payments', desc: '100% safe & encrypted' },
              { icon: Zap, title: '1 Sec Delivery', desc: 'WhatsApp & Email' },
              { icon: Headphones, title: 'Technical Support', desc: "We're always here to help" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
