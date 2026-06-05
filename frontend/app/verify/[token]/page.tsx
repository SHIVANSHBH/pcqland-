'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    api.post('/auth/verify-email', { token })
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully');
          toast.success('Email verified!');
          setTimeout(() => router.push('/login?verified=true'), 2000);
        } else {
          if (data.message?.toLowerCase().includes('expired')) {
            setStatus('expired');
          } else {
            setStatus('error');
          }
          setMessage(data.message || 'Verification failed');
          toast.error(data.message || 'Verification failed');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
        toast.error('Something went wrong');
      });
  }, [token, router]);

  const icons = {
    loading: (
      <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    ),
    success: (
      <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    expired: (
      <svg className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-4">{icons[status]}</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {status === 'loading' && 'Verifying your email...'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
          {status === 'expired' && 'Link Expired'}
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        {status === 'success' && (
          <p className="text-sm text-gray-400">Redirecting to login...</p>
        )}
        {(status === 'error' || status === 'expired') && (
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}
