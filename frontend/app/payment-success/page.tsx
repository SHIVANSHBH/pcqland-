'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, AlertCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const razorpayOrderId = searchParams.get('order_id');
    const razorpayPaymentId = searchParams.get('payment_id');
    const razorpaySignature = searchParams.get('signature');

    if (razorpayOrderId) setOrderId(razorpayOrderId);

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      setStatus('failed');
      setError('Missing payment details. Please contact support.');
      return;
    }

    async function verifyPayment() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setStatus('failed');
          setError(data.message || 'Payment verification failed');
          return;
        }

        localStorage.removeItem('cart');
        setStatus('success');
        setOrderId(data.order.orderId || razorpayOrderId);
      } catch (err) {
        setStatus('failed');
        setError('Verification failed. Please contact support.');
      }
    }

    verifyPayment();
  }, [searchParams, router]);

  if (status === 'verifying') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6" />
        <h1 className="text-xl font-extrabold text-pcd-text mb-2">Verifying Payment...</h1>
        <p className="text-sm text-pcd-muted">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-pcd-text mb-2">Verification Failed</h1>
        <p className="text-sm text-pcd-muted mb-6">{error}</p>
        <div className="flex flex-col gap-3">
          <Link href="/account/orders" className="btn-primary">
            View My Orders
          </Link>
          <Link href="/contact" className="btn-outline">
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <h1 className="text-2xl font-extrabold text-pcd-text mb-2">Payment Successful!</h1>
      <p className="text-sm text-pcd-muted mb-6">
        Your order has been placed successfully. Your product key(s) will be delivered to your email and WhatsApp within seconds.
      </p>

      <div className="bg-gray-50 border border-pcd-border rounded-xl p-4 mb-6 text-left">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-pcd-muted">Order ID</span>
          <span className="font-semibold text-pcd-text">{orderId}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-pcd-muted">Status</span>
          <span className="text-green-600 font-semibold">Paid</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-pcd-muted">Delivery</span>
          <span className="text-emerald-600 font-semibold">Processing (keys sent)</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/account/orders" className="btn-primary">
          <ShoppingBag className="w-4 h-4" />
          View My Orders
        </Link>
        <Link href="/" className="btn-outline">
          Continue Shopping
        </Link>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <p className="text-xs text-blue-700">
          Your GST invoice will be available in your account within 24 hours. You can download it from the &quot;My Orders&quot; section.
        </p>
      </div>
    </div>
  );
}
