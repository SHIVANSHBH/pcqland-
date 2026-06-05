'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowLeft, Loader2, Shield, CheckCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

type Step = 'email' | 'otp' | 'reset' | 'done';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwords, setPasswords] = useState({ newPass: '', confirmPass: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(p => {
        if (p <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0; }
        return p - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  async function handleSendOtp() {
    if (!email) { toast.error('Enter your email address'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      setStep('otp');
      startTimer();
      toast.success('OTP sent to your email');
    } catch { toast.error('Failed to send OTP'); }
    finally { setLoading(false); }
  }

  async function handleVerifyOtp() {
    if (otp.length < 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      setStep('reset');
      toast.success('OTP verified! Set your new password.');
    } catch { toast.error('Verification failed'); }
    finally { setLoading(false); }
  }

  async function handleResetPassword() {
    if (passwords.newPass.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (passwords.newPass !== passwords.confirmPass) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { error } = await (await import('@/lib/supabase/client')).createClient().auth.updateUser({
        password: passwords.newPass,
      });
      if (error) { toast.error(error.message); return; }
      setStep('done');
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch { toast.error('Failed to reset password'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <Card className="border-gray-100 shadow-lg">
          <CardContent className="p-6 md:p-8">
            {/* Step: Email */}
            {step === 'email' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">Forgot Password?</h2>
                  <p className="text-sm text-gray-500 mt-1">No worries! Enter your email and we&apos;ll send you an OTP.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fp-email">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="fp-email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || !email}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold shadow-lg shadow-blue-200"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            )}

            {/* Step: OTP */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">Check Your Email</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    We&apos;ve sent a 6-digit OTP to{' '}
                    <span className="font-semibold text-gray-700">{email}</span>
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enter OTP <span className="text-red-500">*</span></Label>
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup className="w-full justify-center gap-2">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i} index={i}
                            className="w-10 h-12 md:w-12 md:h-14 text-lg font-bold border-gray-200 rounded-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length < 6}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold shadow-lg shadow-blue-200"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setOtp(''); handleSendOtp(); }}
                      disabled={timer > 0}
                      className="text-sm text-blue-600 hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
                    >
                      {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Reset */}
            {step === 'reset' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                    <KeyRound className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">Set New Password</h2>
                  <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters long.</p>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="fp-newpass">New Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="fp-newpass"
                        type={showNew ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={passwords.newPass}
                        onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                        className="h-11 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fp-confirm">Confirm Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="fp-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter new password"
                        value={passwords.confirmPass}
                        onChange={e => setPasswords(p => ({ ...p, confirmPass: e.target.value }))}
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
                  </div>
                  {passwords.newPass.length > 0 && passwords.newPass === passwords.confirmPass && passwords.newPass.length >= 8 && (
                    <div className="flex items-center gap-1.5 text-xs text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Passwords match & meet requirements
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading || passwords.newPass.length < 8 || passwords.newPass !== passwords.confirmPass}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold shadow-lg shadow-blue-200"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            )}

            {/* Step: Done */}
            {step === 'done' && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Password Reset!</h2>
                  <p className="text-sm text-gray-500 mt-1">Your password has been updated successfully. Redirecting to login...</p>
                </div>
                <Button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold"
                >
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Shield className="w-4 h-4 text-gray-400" />
          <p className="text-xs text-gray-400">Your data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}
