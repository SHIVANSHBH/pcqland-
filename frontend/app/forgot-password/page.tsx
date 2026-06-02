'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Lock, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('If the email exists, a reset code has been sent');
      setStep('code');
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  async function resetPassword() {
    if (!code || code.length !== 6) { toast.error('Enter a valid 6-digit code'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, code, password });
      toast.success('Password reset successful. Please login.');
      window.location.href = '/login';
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-pcd-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-pcd-text">Forgot Password</h1>
            <p className="text-sm text-pcd-muted mt-1">
              {step === 'email' ? "Enter your email to receive a reset code" :
               step === 'code' ? 'Enter the 6-digit code sent to your email' :
               'Enter your new password'}
            </p>
          </div>

          {step === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                  placeholder="you@example.com" required />
              </div>
              <button onClick={sendCode} disabled={loading}
                className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Reset Code</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)}
                  className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors text-center tracking-widest"
                  placeholder="· · · · · ·" maxLength={6} />
              </div>
              <button onClick={() => setStep('reset')} disabled={code.length !== 6}
                className="btn-primary w-full disabled:opacity-50">
                Verify Code
              </button>
              <button onClick={sendCode} disabled={loading}
                className="w-full text-sm text-pcd-muted hover:text-primary transition-colors">
                Resend code
              </button>
            </div>
          )}

          {step === 'reset' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                  placeholder="Min. 6 characters" minLength={6} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                  placeholder="Re-enter password" minLength={6} required />
              </div>
              <button onClick={resetPassword} disabled={loading}
                className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-pcd-muted hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
