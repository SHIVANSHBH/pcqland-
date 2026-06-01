'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  const updateQty = (slug: string, delta: number) => {
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
      return next;
    });
  };

  const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h1 className="text-xl font-extrabold text-pcd-text">Shopping Cart ({cartItems.length})</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white border border-pcd-border rounded-2xl">
          <ShoppingBag className="w-16 h-16 text-pcd-muted mx-auto mb-4" />
          <h3 className="text-lg font-bold text-pcd-text mb-2">Your cart is empty</h3>
          <Link href="/" className="btn-primary inline-flex">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item: any) => (
              <div key={item.slug} className="bg-white border border-pcd-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                  {item.name?.charAt(0) || 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} className="text-sm font-bold text-pcd-text hover:text-primary truncate block">{item.name}</Link>
                  <p className="text-xs text-pcd-muted mt-0.5">{formatPrice(item.price)} each</p>
                </div>
                <div className="flex items-center border border-pcd-border rounded-lg">
                  <button onClick={() => updateQty(item.slug, -1)} className="px-2.5 py-1.5 text-pcd-muted hover:text-pcd-text text-sm">-</button>
                  <span className="px-3 py-1.5 text-sm font-semibold border-x border-pcd-border">{item.quantity}</span>
                  <button onClick={() => updateQty(item.slug, 1)} className="px-2.5 py-1.5 text-pcd-muted hover:text-pcd-text text-sm">+</button>
                </div>
                <p className="text-sm font-extrabold text-pcd-text min-w-[70px] text-right">{formatPrice(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.slug)} className="p-1.5 text-pcd-muted hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border border-pcd-border rounded-xl p-5 h-fit">
            <h3 className="text-sm font-bold text-pcd-text mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-pcd-muted">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-pcd-muted">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <hr className="border-pcd-border" />
              <div className="flex justify-between font-extrabold text-pcd-text text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link href={`/checkout?items=${encodeURIComponent(JSON.stringify(cartItems.map((i: any) => ({ slug: i.slug, qty: i.quantity }))))}`} className="btn-primary w-full mt-4">
              Proceed to Checkout
            </Link>
            <Link href="/" className="flex items-center justify-center gap-1.5 text-xs text-pcd-muted hover:text-primary mt-3">
              <ArrowLeft className="w-3 h-3" /> Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
