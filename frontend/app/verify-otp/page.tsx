'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function VerifyOtpPage() {
  const router = useRouter();

  function handleMock() {
    console.log('Auth disabled — OTP verify bypassed');
    toast.success('Auth disabled — OTP verification not needed');
    router.push('/login');
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
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">Verify OTP</h2>
              <p className="text-sm text-gray-500 mt-1">
                OTP verification disabled — site is public
              </p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleMock}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold shadow-lg shadow-blue-200 rounded-xl"
              >
                Continue to Login
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
