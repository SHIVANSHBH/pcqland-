'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Lock, ChevronRight } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const productParam = searchParams.get('product');
    const qtyParam = searchParams.get('qty');
    const itemsParam = searchParams.get('items');

    if (productParam && qtyParam) {
      const saved = localStorage.getItem('cart');
      const existingCart = saved ? JSON.parse(saved) : [];
      const existing = existingCart.find((i: any) => i.slug === productParam);
      if (existing) {
        setCartItems([{ ...existing, quantity: parseInt(qtyParam) || 1 }]);
      } else {
        setCartItems([{ slug: productParam, quantity: parseInt(qtyParam) || 1 }]);
      }
    } else if (itemsParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(itemsParam));
        setCartItems(parsed.map((i: any) => ({ slug: i.slug, name: i.name, price: i.price, quantity: i.qty })));
      } catch {
        const saved = localStorage.getItem('cart');
        if (saved) setCartItems(JSON.parse(saved));
      }
    } else {
      const saved = localStorage.getItem('cart');
      if (saved) setCartItems(JSON.parse(saved));
    }
  }, [searchParams]);

  const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price || 0) * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + tax;

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const items = cartItems.map((item: any) => ({
        slug: item.slug,
        quantity: item.quantity,
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          customerInfo: form,
          paymentMethod: 'razorpay',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => openRazorpay(data.razorpayOrder);
        document.body.appendChild(script);
      } else {
        openRazorpay(data.razorpayOrder);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openRazorpay = (order: any) => {
    const options = {
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      name: 'PC Deals India',
      description: 'Software License Keys Purchase',
      order_id: order.id,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      handler: function (response: any) {
        router.push(`/payment-success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}&signature=${response.razorpay_signature}`);
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-pcd-muted mb-6">
        <Link href="/cart" className="hover:text-primary">Cart</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-pcd-text font-semibold">Checkout</span>
      </div>

      <h1 className="text-2xl font-extrabold text-pcd-text mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-pcd-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-pcd-text mb-4">Customer Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">GSTIN (Optional)</label>
                <input type="text" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} className="w-full px-3 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-pcd-muted mb-1">Address (Optional)</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" rows={2} />
            </div>
          </div>

          <div className="bg-white border border-pcd-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-pcd-text mb-4">Payment Method</h3>
            <div className="border-2 border-primary rounded-xl p-4 bg-blue-50/50">
              <div className="flex items-center gap-3">
                <input type="radio" checked readOnly className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-pcd-text">Razorpay</p>
                  <p className="text-xs text-pcd-muted">Pay via UPI, Cards, Net Banking, Wallet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-pcd-border rounded-xl p-6 h-fit">
          <h3 className="text-sm font-bold text-pcd-text mb-4">Order Summary</h3>
          {cartItems.length > 0 && (
            <div className="space-y-2 mb-4 pb-4 border-b border-pcd-border">
              {cartItems.map((item: any) => (
                <div key={item.slug} className="flex justify-between text-sm">
                  <span className="text-pcd-muted truncate max-w-[180px]">{item.name || item.slug} x{item.quantity}</span>
                  <span className="font-semibold">{formatPrice((item.price || 0) * item.quantity)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-pcd-muted">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pcd-muted">GST (18%)</span>
              <span className="font-semibold">{formatPrice(tax)}</span>
            </div>
            <hr className="border-pcd-border" />
            <div className="flex justify-between text-base">
              <span className="font-bold text-pcd-text">Total</span>
              <span className="font-extrabold text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <button onClick={handleRazorpayPayment} disabled={loading || !form.name || !form.email || !form.phone} className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
            <Lock className="w-4 h-4" />
            {loading ? 'Processing...' : `Pay ${formatPrice(total)} Securely`}
          </button>

          <div className="mt-4 text-[10px] text-pcd-muted text-center">
            Your payment is processed securely via Razorpay. We do not store your card details.
          </div>
        </div>
      </div>
    </div>
  );
}
