'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'done'>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  async function handleSendCode() {
    if (!email) { toast.error('Enter email'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      toast.success('Reset code sent to email');
      setStep('otp');
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  async function handleVerifyCode() {
    if (!code || code.length < 6) { toast.error('Enter valid code'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      toast.success('Code verified');
      setStep('reset');
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  async function handleResetPassword() {
    if (!newPassword || newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      toast.success('Password reset successful!');
      setStep('done');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) { toast.error(err.message); }
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
                  placeholder="you@example.com" />
              </div>
              <button onClick={handleSendCode} disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                {loading ? 'Processing...' : 'Send Reset Code'}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reset Code</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center tracking-[0.5em] font-bold"
                  placeholder="· · · · · ·" maxLength={6} />
              </div>
              <button onClick={handleVerifyCode} disabled={loading || code.length < 6}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                {loading ? 'Processing...' : 'Verify Code'}
              </button>
            </div>
          )}

          {step === 'reset' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Min. 6 characters" minLength={6} />
              </div>
              <button onClick={handleResetPassword} disabled={loading || newPassword.length < 6}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                {loading ? 'Processing...' : 'Reset Password'}
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
