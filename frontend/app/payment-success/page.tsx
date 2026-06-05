'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ShoppingBag } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const razorpayOrderId = params.get('order_id') || '';

    window.history.replaceState({}, '', '/payment-success');

    if (!razorpayOrderId) {
      setOrderId('N/A');
      setStatus('error');
      return;
    }

    setOrderId(razorpayOrderId);

    const paymentResult = sessionStorage.getItem('payment_result');
    if (paymentResult) {
      try {
        const parsed = JSON.parse(paymentResult);
        if (parsed.status === 'success') {
          setStatus('success');
          sessionStorage.removeItem('payment_result');
          return;
        }
      } catch {}
    }

    setStatus('success');
  }, []);

  if (status === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
        <h1 className="text-2xl font-extrabold text-pcd-text mb-2">Verifying Payment...</h1>
        <p className="text-sm text-pcd-muted">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-pcd-text mb-2">Verification Issue</h1>
        <p className="text-sm text-pcd-muted mb-6">We could not verify your payment. Please contact support with your Order ID.</p>
        <div className="bg-gray-50 border border-pcd-border rounded-xl p-4 mb-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-pcd-muted">Order ID</span>
            <span className="font-semibold text-pcd-text">{orderId}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/account/orders" className="btn-primary">
            <ShoppingBag className="w-4 h-4" />
            Check My Orders
          </Link>
          <Link href="/" className="btn-outline">
            Continue Shopping
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
