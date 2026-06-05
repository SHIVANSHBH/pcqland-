'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Lock, Eye, EyeOff, Mail, Smartphone, Shield, History, Wallet, Headphones, Zap, CheckCircle, Star, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

const features = [
  { icon: Shield, title: 'Secure Login', desc: 'Your account is fully encrypted & protected' },
  { icon: History, title: 'Order History', desc: 'Track all your orders in one place' },
  { icon: Wallet, title: 'Wallet & Cashback', desc: 'Manage your balance and save more' },
  { icon: Headphones, title: 'Technical Support', desc: "We're always here to help you" },
];

const testimonials = [
  { name: 'Rahul S.', text: 'Best place for genuine Microsoft keys. Instant delivery!' },
  { name: 'Priya M.', text: 'Excellent support team. Helped me with activation within minutes.' },
  { name: 'Amit K.', text: 'Saved so much money compared to retail. Highly recommended!' },
];

const stats = [
  { count: '20,000+', label: 'Happy Customers' },
  { count: '1 Sec', label: 'WhatsApp & Email Delivery' },
  { count: '24 Hrs', label: 'GST Invoice' },
];

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('password');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const [emailPass, setEmailPass] = useState({ email: '', password: '' });
  const [emailOtp, setEmailOtp] = useState({ email: '', otp: '' });
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  const [phoneOtp, setPhoneOtp] = useState({ phone: '', otp: '' });
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);

  const emailOtpRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phoneOtpRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const testimonialRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    testimonialRef.current = setInterval(() => {
      setTestimonialIndex(i => (i + 1) % testimonials.length);
    }, 4000);
    return () => {
      if (emailOtpRef.current) clearInterval(emailOtpRef.current);
      if (phoneOtpRef.current) clearInterval(phoneOtpRef.current);
      if (testimonialRef.current) clearInterval(testimonialRef.current);
    };
  }, []);

  const startTimer = useCallback((setter: React.Dispatch<React.SetStateAction<number>>, ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>) => {
    setter(30);
    if (ref.current) clearInterval(ref.current);
    ref.current = setInterval(() => {
      setter((p: number) => {
        if (p <= 1) { if (ref.current) clearInterval(ref.current); return 0; }
        return p - 1;
      });
    }, 1000);
  }, []);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!emailPass.email || !emailPass.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailPass.email,
        password: emailPass.password,
      });
      if (error) {
        toast.error(error.message === 'Invalid login credentials' ? 'Invalid email or password' : error.message);
        return;
      }
      toast.success('Login successful!');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function sendPhoneOtpAction() {
    if (phoneOtp.phone.length < 10) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phoneOtp.phone}` }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      setPhoneOtpSent(true);
      toast.success('OTP sent to your mobile');
      startTimer(setPhoneOtpTimer, phoneOtpRef);
    } catch { toast.error('Failed to send OTP'); }
    finally { setLoading(false); }
  }

  async function verifyPhoneOtpAction() {
    if (!phoneOtp.otp || phoneOtp.otp.length < 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phoneOtp.phone}`, otp: phoneOtp.otp }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      toast.success('Login successful!');
      router.push('/');
      router.refresh();
    } catch { toast.error('Verification failed'); }
    finally { setLoading(false); }
  }

  async function sendEmailOtpAction() {
    if (!emailOtp.email) { toast.error('Enter your email address'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOtp.email }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      setEmailOtpSent(true);
      toast.success('OTP sent to your email');
      startTimer(setEmailOtpTimer, emailOtpRef);
    } catch { toast.error('Failed to send OTP'); }
    finally { setLoading(false); }
  }

  async function verifyEmailOtpAction() {
    if (!emailOtp.otp || emailOtp.otp.length < 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOtp.email, otp: emailOtp.otp }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: emailOtp.email,
        password: emailOtp.otp,
      });
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: emailOtp.email,
          password: emailOtp.otp,
          options: { data: { name: emailOtp.email.split('@')[0] } },
        });
        if (signUpError) { toast.error(signUpError.message); return; }
      }
      toast.success('Login successful!');
      router.push('/');
      router.refresh();
    } catch { toast.error('Verification failed'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <section className="px-4 pt-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* LEFT - Marketing Content (40%) */}
            <div className="lg:col-span-2 space-y-6 pt-4 lg:pt-8">
              <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
                Don&apos;t Have an Account? <span className="underline font-bold">Sign Up Free</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  Access Your
                  <br />
                  Account <span className="text-blue-600">Instantly</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-md">
                  Manage orders, track deliveries & save time
                </p>
              </div>

              <div className="space-y-4">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{f.title}</h4>
                        <p className="text-xs text-gray-500">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Testimonial Slider */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic">&ldquo;{testimonials[testimonialIndex].text}&rdquo;</p>
                <p className="text-xs font-semibold text-gray-800 mt-1">— {testimonials[testimonialIndex].name}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg md:text-xl font-extrabold text-blue-600">{s.count}</div>
                    <div className="text-[10px] md:text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT - Login Form (60%) */}
            <div className="lg:col-span-3">
              <Card className="border-gray-100 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                      <Lock className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900">Login to Your Account</h2>
                    <p className="text-sm text-gray-500 mt-1">Sign in to PC Deals India & manage your business</p>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full bg-gray-100 p-1 rounded-xl mb-6">
                      <TabsTrigger value="password" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Lock className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />
                        <span className="hidden sm:inline">Email & Password</span>
                        <span className="sm:hidden">Password</span>
                      </TabsTrigger>
                      <TabsTrigger value="phone-otp" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Smartphone className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />
                        <span className="hidden sm:inline">Mobile OTP</span>
                        <span className="sm:hidden">Mobile</span>
                      </TabsTrigger>
                      <TabsTrigger value="email-otp" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Mail className="w-3.5 h-3.5 mr-1.5 hidden sm:inline" />
                        <span className="hidden sm:inline">Email OTP</span>
                        <span className="sm:hidden">Email</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Email & Password */}
                    <TabsContent value="password">
                      <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email Address <span className="text-red-500">*</span></Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email address"
                            value={emailPass.email}
                            onChange={e => setEmailPass(p => ({ ...p, email: e.target.value }))}
                            required
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <Input
                              id="login-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              value={emailPass.password}
                              onChange={e => setEmailPass(p => ({ ...p, password: e.target.value }))}
                              required
                              className="h-11 pr-11"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold shadow-lg shadow-blue-200"
                        >
                          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          {loading ? 'Signing in...' : 'Login Now'}
                        </Button>
                        <div className="text-center">
                          <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
                            Forgot Your Password?
                          </Link>
                        </div>
                      </form>
                    </TabsContent>

                    {/* Tab 2: Phone OTP */}
                    <TabsContent value="phone-otp">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Mobile Number <span className="text-red-500">*</span></Label>
                          <div className="flex gap-2">
                            <div className="flex items-center px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-medium text-gray-700 h-11 flex-shrink-0">
                              +91
                            </div>
                            <Input
                              type="tel"
                              placeholder="9876543210"
                              value={phoneOtp.phone}
                              onChange={e => setPhoneOtp(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                              disabled={phoneOtpSent}
                              className="h-11 flex-1"
                              maxLength={10}
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                sendPhoneOtpAction();
                              }}
                              disabled={loading || phoneOtpTimer > 0 || phoneOtp.phone.length < 10}
                              className="h-11 px-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold whitespace-nowrap shadow-lg shadow-blue-200"
                            >
                              {phoneOtpTimer > 0 ? `${phoneOtpTimer}s` : phoneOtpSent ? 'Resend' : 'Send OTP'}
                            </Button>
                          </div>
                        </div>
                        {phoneOtpSent && (
                          <>
                            <div className="space-y-2">
                              <Label>Enter OTP <span className="text-red-500">*</span></Label>
                              <InputOTP
                                maxLength={6}
                                value={phoneOtp.otp}
                                onChange={v => setPhoneOtp(p => ({ ...p, otp: v }))}
                              >
                                <InputOTPGroup className="w-full justify-center gap-2">
                                  {[...Array(6)].map((_, i) => (
                                    <InputOTPSlot
                                      key={i}
                                      index={i}
                                      className="w-10 h-12 md:w-12 md:h-14 text-lg font-bold border-gray-200 rounded-lg"
                                    />
                                  ))}
                                </InputOTPGroup>
                              </InputOTP>
                            </div>
                            <Button
                              type="button"
                              onClick={() => {
                                verifyPhoneOtpAction();
                              }}
                              disabled={loading || phoneOtp.otp.length < 6}
                              className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold shadow-lg shadow-blue-200"
                            >
                              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              {loading ? 'Verifying...' : 'Verify & Login'}
                            </Button>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    {/* Tab 3: Email OTP */}
                    <TabsContent value="email-otp">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Email Address <span className="text-red-500">*</span></Label>
                          <div className="flex gap-2">
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              value={emailOtp.email}
                              onChange={e => setEmailOtp(p => ({ ...p, email: e.target.value }))}
                              disabled={emailOtpSent}
                              className="h-11 flex-1"
                            />
                            <Button
                              type="button"
                              onClick={sendEmailOtpAction}
                              disabled={loading || emailOtpTimer > 0}
                              className="h-11 px-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold whitespace-nowrap shadow-lg shadow-blue-200"
                            >
                              {emailOtpTimer > 0 ? `${emailOtpTimer}s` : emailOtpSent ? 'Resend' : 'Send OTP'}
                            </Button>
                          </div>
                        </div>
                        {emailOtpSent && (
                          <>
                            <div className="space-y-2">
                              <Label>Enter OTP <span className="text-red-500">*</span></Label>
                              <InputOTP
                                maxLength={6}
                                value={emailOtp.otp}
                                onChange={v => setEmailOtp(p => ({ ...p, otp: v }))}
                              >
                                <InputOTPGroup className="w-full justify-center gap-2">
                                  {[...Array(6)].map((_, i) => (
                                    <InputOTPSlot
                                      key={i}
                                      index={i}
                                      className="w-10 h-12 md:w-12 md:h-14 text-lg font-bold border-gray-200 rounded-lg"
                                    />
                                  ))}
                                </InputOTPGroup>
                              </InputOTP>
                            </div>
                            <Button
                              type="button"
                              onClick={verifyEmailOtpAction}
                              disabled={loading || emailOtp.otp.length < 6}
                              className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold shadow-lg shadow-blue-200"
                            >
                              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              {loading ? 'Verifying...' : 'Verify & Login'}
                            </Button>
                          </>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                      Don&apos;t have an account?{' '}
                      <Link href="/signup" className="text-blue-600 font-bold hover:underline">Create Account</Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Features */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: Shield, title: 'Secure Payments', desc: '100% safe & encrypted' },
                  { icon: Zap, title: '1 Sec Delivery', desc: 'WhatsApp & Email' },
                  { icon: Headphones, title: 'Technical Support', desc: "We're always here to help" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 text-[11px] leading-tight">{item.title}</h4>
                        <p className="text-[10px] text-gray-500 leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
