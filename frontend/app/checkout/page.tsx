'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Lock, ChevronRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gstin: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const productParam = searchParams?.get('product');
    const qtyParam = searchParams?.get('qty');
    const itemsParam = searchParams?.get('items');

    if (productParam && qtyParam) {
      const qty = parseInt(qtyParam) || 1;
      try {
        const saved = localStorage.getItem('cart');
        const existingCart = saved ? JSON.parse(saved) : [];
        if (Array.isArray(existingCart)) {
          const existing = existingCart.find((i: any) => i.slug === productParam);
          if (existing) {
            setCartItems([{ ...existing, quantity: qty }]);
            return;
          }
        }
      } catch {}

      api.get(`/products/${productParam}`).then((product) => {
        setCartItems([{ _id: product._id, slug: productParam, name: product.name, price: product.price, quantity: qty }]);
      }).catch(() => {
        setCartItems([{ slug: productParam, quantity: qty }]);
      });
    } else if (itemsParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(itemsParam));
        setCartItems(parsed.map((i: any) => ({ _id: i._id, slug: i.slug, name: i.name, price: i.price, quantity: i.qty })));
      } catch {
        router.push('/cart');
      }
    } else {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const items = JSON.parse(saved);
        if (items.length === 0) {
          router.push('/cart');
          return;
        }
        setCartItems(items);
      } else {
        router.push('/cart');
      }
    }
  }, [searchParams, router]);

  const updateItemQty = (slug: string, delta: number) => {
    setCartItems(prev => {
      const next = prev.map(item =>
        item.slug === slug ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (slug: string) => {
    setCartItems(prev => {
      const next = prev.filter(item => item.slug !== slug);
      localStorage.setItem('cart', JSON.stringify(next));
      if (next.length === 0) router.push('/cart');
      return next;
    });
  };

  const taxRate = parseFloat(process.env.NEXT_PUBLIC_TAX_RATE || '0.18');
  const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price || 0) * item.quantity, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + tax;

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const data = await api.post('/orders/create', {
        items: cartItems.map((i: any) => ({
          productId: i._id,
          slug: i.slug,
          quantity: i.quantity,
        })),
        customerInfo: form,
        paymentMethod: 'razorpay',
      });

      if (!data.razorpayOrder) {
        toast.error(data.message || 'Failed to create order');
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
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
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
        router.push(
          `/payment-success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}&razorpay_signature=${response.razorpay_signature}`
        );
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
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-3 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-3 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-3 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-pcd-muted mb-1">GSTIN (Optional)</label>
                <input type="text" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} className="w-full px-3 py-3 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors" />
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
          <h3 className="text-sm font-bold text-pcd-text mb-4">
            Order Summary ({cartItems.length} items)
          </h3>

          {/* Cart Items */}
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {cartItems.map((item: any) => (
              <div key={item.slug} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg flex-wrap sm:flex-nowrap">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                  {item.name?.charAt(0) || 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-pcd-text truncate">{item.name || item.slug}</p>
                  <p className="text-[11px] text-pcd-muted">{formatPrice(item.price || 0)} x {item.quantity}</p>
                </div>
                <div className="flex items-center border border-pcd-border rounded-md ml-auto">
                  <button onClick={() => updateItemQty(item.slug, -1)} className="px-2.5 py-1.5 text-pcd-muted hover:text-pcd-text text-xs">-</button>
                  <span className="px-2.5 py-1.5 text-xs font-semibold border-x border-pcd-border">{item.quantity}</span>
                  <button onClick={() => updateItemQty(item.slug, 1)} className="px-2.5 py-1.5 text-pcd-muted hover:text-pcd-text text-xs">+</button>
                </div>
                <p className="text-xs font-extrabold text-pcd-text text-right">{formatPrice((item.price || 0) * item.quantity)}</p>
                <button onClick={() => removeItem(item.slug)} className="p-2 text-pcd-muted hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-pcd-muted">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pcd-muted">GST ({Math.round(taxRate * 100)}%)</span>
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

          <div className="mt-4 text-[11px] text-pcd-muted text-center">
            Your payment is processed securely via Razorpay. We do not store your card details.
          </div>
        </div>
      </div>
    </div>
  );
}
