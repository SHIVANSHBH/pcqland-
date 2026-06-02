'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Shield, Clock, Wallet, HeadphonesIcon, Star, User, Lock, Mail, Phone } from 'lucide-react';

const testimonials = [
  { name: 'Dattatray Gaikwad', location: 'Nashik, MAHARASHTRA', date: 'Apr 15, 2026', text: 'good service', rating: 5 },
  { name: 'Mohamed Abuthahir', location: 'Pudukkottai, TAMIL NADU', date: 'Mar 6, 2026', text: 'Very Good Experience', rating: 5 },
  { name: 'Anand Kumar', location: 'Dumka, JHARKHAND', date: 'Mar 25, 2026', text: 'Very nice Service 😃', rating: 5 },
  { name: 'A TO Z COMPUTERS', location: 'Chennai, TAMIL NADU', date: 'Apr 29, 2026', text: '5*', rating: 5 },
  { name: 'Kamal vasandani', location: 'Kanpur, Up', date: 'Apr 13, 2026', text: 'excellent', rating: 5 },
  { name: 'Mukesh Kumar', location: 'Ranchi, Jharkhand', date: 'Apr 28, 2026', text: 'great price and services', rating: 5 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

function LoginWithEmailPassword({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      toast.success('Login successful!');
      onSuccess();
      if (res.data?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-pcd-muted mb-1">Email Address *</label>
        <input
          type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
          placeholder="Enter your email address" required
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-pcd-muted mb-1">Password *</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors pr-10"
            placeholder="Enter your password" required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-pcd-muted hover:text-pcd-text">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? 'Signing in...' : 'Login Now'}
      </button>
      <div className="text-center">
        <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot Your Password?</Link>
      </div>
    </form>
  );
}

function LoginWithMobileOTP({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone });
      toast.success('OTP sent to your phone');
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { phone, otp });
      toast.success('Login successful!');
      onSuccess();
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <form onSubmit={sendOtp} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-pcd-muted mb-1">Phone Number *</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
            placeholder="+91 9876543210" required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyOtp} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-pcd-muted mb-1">Enter OTP *</label>
        <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
          className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors text-center text-lg tracking-[0.5em]"
          placeholder="000000" required />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? 'Verifying...' : 'Verify & Login'}
      </button>
      <button type="button" onClick={() => { setStep('phone'); setOtp(''); }} className="text-xs text-pcd-muted hover:text-primary w-full text-center">
        Change phone number
      </button>
    </form>
  );
}

function LoginWithEmailOTP({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/send-email-otp', { email });
      toast.success('OTP sent to your email');
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-email-otp', { email, otp });
      toast.success('Login successful!');
      onSuccess();
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <form onSubmit={sendOtp} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-pcd-muted mb-1">Email Address *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
            placeholder="Enter your email address" required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyOtp} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-pcd-muted mb-1">Enter OTP *</label>
        <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
          className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors text-center text-lg tracking-[0.5em]"
          placeholder="000000" required />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? 'Verifying...' : 'Verify & Login'}
      </button>
      <button type="button" onClick={() => { setStep('email'); setOtp(''); }} className="text-xs text-pcd-muted hover:text-primary w-full text-center">
        Change email
      </button>
    </form>
  );
}

function GoogleSignIn({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    toast.error('Google login requires setup. Configure GOOGLE_CLIENT_ID in .env');
  };

  return (
    <button onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-pcd-border rounded-xl text-sm font-medium text-pcd-text hover:bg-gray-50 transition-colors">
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  );
}

type Tab = 'password' | 'mobile-otp' | 'email-otp';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>('password');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex(i => (i + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const tabs: { id: Tab; label: string; icon: typeof Lock }[] = [
    { id: 'password', label: 'Login with Email & Password', icon: Lock },
    { id: 'mobile-otp', label: 'Login with Mobile (OTP)', icon: Phone },
    { id: 'email-otp', label: 'Login with Email (OTP)', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Left Column - Sign Up CTA + Testimonials */}
          <div className="space-y-8 lg:sticky lg:top-12">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-8 lg:p-10 text-white">
              <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-2">
                Sign Up Free<br />
                <span className="text-blue-200">Access Your</span><br />
                Account Instantly <span className="text-blue-200">&#x1F513;</span>
              </h2>
              <p className="text-blue-100 text-sm mt-4 mb-6">
                Manage orders, track deliveries & save time
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: 'Secure Login', sub: 'Your account is fully encrypted & protected' },
                  { icon: Clock, text: 'Order History', sub: 'Track all your orders in one place' },
                  { icon: Wallet, text: 'Wallet & Cashback', sub: 'Manage your balance and save more' },
                  { icon: HeadphonesIcon, text: 'Technical Support', sub: "We're always here to help you" },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{text}</p>
                      <p className="text-xs text-blue-200">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Carousel */}
            <div className="bg-white border border-pcd-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h3 className="text-sm font-bold text-pcd-text">Customer Reviews / Testimonials</h3>
              </div>
              <div className="relative overflow-hidden">
                <div className="transition-all duration-500" style={{ transform: `translateX(-${testimonialIndex * 100}%)`, display: 'flex' }}>
                  {testimonials.map((t, i) => (
                    <div key={i} className="min-w-full pr-4">
                      <StarRating rating={t.rating} />
                      <p className="text-sm text-pcd-text mt-2 mb-1">&ldquo;{t.text}&rdquo;</p>
                      <p className="text-xs font-semibold text-pcd-text">{t.name}</p>
                      <p className="text-[10px] text-pcd-muted">{t.location}</p>
                      <p className="text-[10px] text-pcd-muted">{t.date}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setTestimonialIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIndex ? 'bg-primary' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-pcd-muted">{testimonialIndex + 1}/{testimonials.length}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '20000+', label: 'Happy Customers' },
                { value: '1 Sec', label: 'WhatsApp and Email Delivery' },
                { value: '24 Hrs', label: 'GST Invoice' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white border border-pcd-border rounded-xl p-3 text-center">
                  <p className="text-lg font-extrabold text-primary">{value}</p>
                  <p className="text-[10px] text-pcd-muted leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white border border-pcd-border rounded-2xl p-6 lg:p-8">
            <div className="text-center mb-6">
              <h1 className="text-xl font-extrabold text-pcd-text">Login to Your Account</h1>
              <p className="text-sm text-pcd-muted mt-1">Sign in to PC Deals India & manage your business</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-col gap-1 mb-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-pcd-text hover:bg-blue-50 border border-pcd-border'
                  }`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[220px]">
              {activeTab === 'password' && <LoginWithEmailPassword onSuccess={() => {}} />}
              {activeTab === 'mobile-otp' && <LoginWithMobileOTP onSuccess={() => {}} />}
              {activeTab === 'email-otp' && <LoginWithEmailOTP onSuccess={() => {}} />}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-pcd-border" />
              <span className="text-xs text-pcd-muted">or continue with</span>
              <div className="flex-1 h-px bg-pcd-border" />
            </div>

            {/* Google */}
            <GoogleSignIn onSuccess={() => {}} />

            {/* Register Link */}
            <p className="text-center text-sm text-pcd-muted mt-5">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {[
            { icon: Shield, text: 'Secure Payments', sub: '100% safe & encrypted' },
            { icon: Clock, text: '1 Sec Delivery', sub: 'WhatsApp & Email' },
            { icon: HeadphonesIcon, text: 'Technical Support', sub: "We're always here to help" },
          ].map(({ icon: Icon, text, sub }) => (
            <div key={text} className="bg-white border border-pcd-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-pcd-text">{text}</p>
                <p className="text-xs text-pcd-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}