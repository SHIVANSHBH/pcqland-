'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Shield, History, Wallet, Headphones, Star, ArrowRight, Loader2, UserPlus, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const features = [
  { icon: Shield, title: 'Secure Account', desc: 'Your data is fully encrypted & protected' },
  { icon: History, title: 'Order History', desc: 'Track all your orders in one place' },
  { icon: Wallet, title: 'Wallet & Cashback', desc: 'Manage your balance and save more' },
  { icon: Headphones, title: '24/7 Support', desc: "We're always here to help you" },
];

const testimonials = [
  { name: 'Rahul S.', text: 'Best place for genuine Microsoft keys. Instant delivery!' },
  { name: 'Priya M.', text: 'Excellent support team. Helped me with activation within minutes.' },
  { name: 'Amit K.', text: 'Saved so much money compared to retail. Highly recommended!' },
];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!form.acceptTerms) {
      toast.error('Please accept the terms & conditions');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            phone: form.phone || null,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('An account with this email already exists. Please login.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data?.user?.identities?.length === 0) {
        toast.error('An account with this email already exists. Please login.');
        return;
      }

      toast.success('Account created successfully! Welcome to PC Deals India.');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <section className="px-4 pt-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* LEFT - Marketing Content (40%) */}
            <div className="lg:col-span-2 space-y-6 pt-4 lg:pt-8">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
                Already have an account? <span className="underline font-bold">Sign In</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  Join
                  <br />
                  <span className="text-blue-600">PC Deals India</span>
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-md">
                  Create your account & unlock exclusive deals
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

              {/* Testimonial */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic">&ldquo;{testimonials[testimonialIndex].text}&rdquo;</p>
                <p className="text-xs font-semibold text-gray-800 mt-1">— {testimonials[testimonialIndex].name}</p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: CheckCircle, label: 'Instant Delivery' },
                  { icon: CheckCircle, label: 'GST Invoice' },
                  { icon: CheckCircle, label: '24/7 Support' },
                  { icon: CheckCircle, label: 'Secure Payments' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100 shadow-sm">
                      <Icon className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-700">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT - Signup Form (60%) */}
            <div className="lg:col-span-3">
              <Card className="border-gray-100 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                      <UserPlus className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900">Create Your Account</h2>
                    <p className="text-sm text-gray-500 mt-1">Join PC Deals India & start saving on software</p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Mobile Number (Optional)</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-medium text-gray-700 h-11 flex-shrink-0">
                          +91
                        </div>
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="9876543210"
                          value={form.phone}
                          onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                          className="h-11 flex-1"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 8 characters"
                            value={form.password}
                            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                            required
                            minLength={8}
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
                        {form.password.length > 0 && form.password.length < 8 && (
                          <p className="text-xs text-red-500 mt-1">{8 - form.password.length} more characters needed</p>
                        )}
                        {form.password.length >= 8 && (
                          <p className="text-xs text-green-600 mt-1">Password strength: Good</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm">
                          Confirm Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-confirm"
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Re-enter password"
                            value={form.confirmPassword}
                            onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                            required
                            minLength={8}
                            className="h-11 pr-11"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {form.confirmPassword.length > 0 && form.password !== form.confirmPassword && (
                          <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                        {form.confirmPassword.length > 0 && form.password === form.confirmPassword && (
                          <p className="text-xs text-green-600 mt-1">Passwords match</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={form.acceptTerms}
                        onChange={e => setForm(p => ({ ...p, acceptTerms: e.target.checked }))}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline font-medium">Terms & Conditions</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold shadow-lg shadow-blue-200"
                    >
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>

                  <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                      Already have an account?{' '}
                      <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
