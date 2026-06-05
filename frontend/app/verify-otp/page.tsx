'use client';

import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Smartphone, Loader2, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const phoneParam = searchParams.get('phone');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const identifier = emailParam || phoneParam || '';
  const type = emailParam ? 'email' : 'phone';

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

  async function handleVerify() {
    if (otp.length < 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const body = emailParam
        ? { email: emailParam, otp }
        : { phone: phoneParam, otp };

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }

      toast.success('Verified successfully!');
      router.push('/login');
    } catch { toast.error('Verification failed'); }
    finally { setLoading(false); }
  }

  async function handleResend() {
    setLoading(true);
    try {
      const body = emailParam
        ? { email: emailParam }
        : { phone: phoneParam };

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.message); return; }
      setOtp('');
      startTimer();
      toast.success('OTP resent');
    } catch { toast.error('Failed to resend OTP'); }
    finally { setLoading(false); }
  }

  if (!identifier) {
    return (
      <Card className="border-gray-100 shadow-lg max-w-md w-full">
        <CardContent className="p-6 md:p-8 text-center">
          <h2 className="text-xl font-extrabold text-gray-900">Invalid Link</h2>
          <p className="text-sm text-gray-500 mt-2">No email or phone number provided.</p>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-4">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100 shadow-lg">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
            {type === 'email' ? <Mail className="w-7 h-7 text-white" /> : <Smartphone className="w-7 h-7 text-white" />}
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Verify OTP</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the 6-digit code sent to{' '}
            <span className="font-semibold text-gray-700 break-all">{identifier}</span>
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
            onClick={handleVerify}
            disabled={loading || otp.length < 6}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm font-bold shadow-lg shadow-blue-200"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className="text-sm text-blue-600 hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <Suspense fallback={
          <Card className="border-gray-100 shadow-lg">
            <CardContent className="p-6 md:p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            </CardContent>
          </Card>
        }>
          <VerifyOtpForm />
        </Suspense>

        <div className="flex items-center justify-center gap-2 mt-6">
          <Shield className="w-4 h-4 text-gray-400" />
          <p className="text-xs text-gray-400">Your data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}
