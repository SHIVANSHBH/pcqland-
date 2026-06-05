'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'done'>('email');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  async function sendOtp() {
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      toast.success('OTP sent to your email');
      setStep('otp');
      setTimer(60);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setTimer(p => { if (p <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0; } return p - 1; }), 1000);
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    if (otp.length < 6) { toast.error('Enter valid 6-digit OTP'); return; }
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
      toast.success('OTP verified! Set a new password.');
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  async function resetPassword() {
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { toast.error(error.message); return; }
      setStep('done');
      toast.success('Password reset successful!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">Forgot Password</h1>
            <p className="text-sm text-gray-500 mt-1">
              {step === 'email' ? "Enter your email to receive a reset code" :
               step === 'otp' ? 'Enter the 6-digit code sent to your email' :
               step === 'reset' ? 'Enter your new password' :
               'Password reset successful!'}
            </p>
          </div>

          {step === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="you@example.com" required />
              </div>
              <button onClick={sendOtp} disabled={loading || !email}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reset Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center tracking-[0.5em] font-bold"
                  placeholder="· · · · · ·" maxLength={6} />
              </div>
              <button onClick={verifyOtp} disabled={otp.length !== 6 || loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <div className="text-center">
                <button onClick={sendOtp} disabled={timer > 0}
                  className="text-sm text-blue-600 hover:underline font-medium disabled:text-gray-400 disabled:no-underline">
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend code'}
                </button>
              </div>
            </div>
          )}

          {step === 'reset' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-11"
                    placeholder="Min. 6 characters" minLength={6} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Re-enter password" minLength={6} required />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
              <button onClick={resetPassword} disabled={loading || password.length < 6 || password !== confirmPassword}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Your password has been reset. Redirecting to login...</p>
              <Link href="/login"
                className="inline-block w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 text-center">
                Go to Login
              </Link>
            </div>
          )}

          {step !== 'done' && (
            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
