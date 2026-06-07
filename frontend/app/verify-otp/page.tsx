'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const mode = email ? 'email' : 'phone';

  async function handleVerify() {
    if (!otp || otp.length < 6) { toast.error('Enter valid OTP'); return; }
    setLoading(true);
    try {
      const body = mode === 'email' ? { email, otp } : { phone, otp };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message || 'OTP verification failed'); return; }
      toast.success('OTP verified successfully');
      router.push('/login');
    } catch (err: any) { toast.error(err.message || 'Verification failed'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <Card className="border-gray-100 shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                {mode === 'email' ? <Mail className="w-7 h-7 text-white" /> : <Smartphone className="w-7 h-7 text-white" />}
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">Verify OTP</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter the code sent to {mode === 'email' ? email : phone}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">One-Time Password</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center tracking-[0.5em] font-bold"
                  placeholder="· · · · · ·" maxLength={6} />
              </div>
              <button onClick={handleVerify} disabled={loading || otp.length < 6}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold shadow-lg shadow-blue-200 rounded-xl disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 mt-6">
          <p className="text-xs text-gray-400">Your data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}
