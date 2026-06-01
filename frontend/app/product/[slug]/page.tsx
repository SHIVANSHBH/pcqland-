'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Shield, Zap, FileText, CheckCircle, ShoppingCart, ChevronRight, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const fallbackProducts: Record<string, { name: string; price: number; mrp: number; desc: string; validity: string; features: string[] }> = {
  'windows-11-pro': {
    name: 'Windows 11 Pro', price: 1499, mrp: 12999,
    desc: 'Genuine Microsoft Windows 11 Professional License Key. Lifetime validity, 1 PC. Digital delivery via email & WhatsApp.',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License Key', 'Lifetime Validity', '1 PC License', 'Instant Email & WhatsApp Delivery', 'GST Invoice Available', '24x7 Technical Support'],
  },
  'windows-11-home': {
    name: 'Windows 11 Home', price: 999, mrp: 8999,
    desc: 'Genuine Microsoft Windows 11 Home License Key. Lifetime validity, 1 PC.',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License Key', 'Lifetime Validity', '1 PC License', 'Instant Email & WhatsApp Delivery', 'GST Invoice Available'],
  },
  'windows-10-pro': {
    name: 'Windows 10 Pro', price: 1299, mrp: 10999,
    desc: 'Genuine Microsoft Windows 10 Professional License Key. Lifetime validity, 1 PC.',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License Key', 'Lifetime Validity', '1 PC License', 'Instant Email & WhatsApp Delivery', 'GST Invoice Available'],
  },
  'windows-10-home': {
    name: 'Windows 10 Home', price: 899, mrp: 7999,
    desc: 'Genuine Microsoft Windows 10 Home License Key. Lifetime validity, 1 PC.',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License Key', 'Lifetime Validity', '1 PC License', 'Instant Email & WhatsApp Delivery', 'GST Invoice Available'],
  },
  'office-2021-pro-plus': {
    name: 'Microsoft Office 2021 Pro Plus', price: 2499, mrp: 28999,
    desc: 'Microsoft Office 2021 Professional Plus License Key for 1 PC.',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License Key', 'Lifetime Validity', '1 PC License', 'Includes Word, Excel, PPT, Outlook', 'Instant Email & WhatsApp Delivery', 'GST Invoice Available'],
  },
  'office-2019-pro-plus': {
    name: 'Microsoft Office 2019 Pro Plus', price: 1999, mrp: 24999,
    desc: 'Microsoft Office 2019 Professional Plus License Key for 1 PC.',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License Key', 'Lifetime Validity', '1 PC License', 'Includes Word, Excel, PPT, Outlook', 'Instant Email & WhatsApp Delivery', 'GST Invoice Available'],
  },
  'office-2021-home-student': {
    name: 'Microsoft Office 2021 Home Student', price: 1499, mrp: 12999,
    desc: 'Microsoft Office 2021 Home & Student License Key.',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License Key', 'Lifetime Validity', '1 PC License', 'Instant Email & WhatsApp Delivery', 'GST Invoice Available'],
  },
  'win11-office2021-combo': {
    name: 'Windows 11 Pro + Office 2021 Pro Plus Combo', price: 3499, mrp: 41998,
    desc: 'Save big with this combo deal! Get Windows 11 Pro + Office 2021 Pro Plus at an unbeatable price.',
    validity: 'Lifetime',
    features: ['Both Genuine Microsoft Licenses', 'Lifetime Validity', 'Instant Delivery', 'GST Invoice Available', 'Big Savings'],
  },
  'kaspersky-internet-security-1y': {
    name: 'Kaspersky Internet Security 1Y-1PC', price: 599, mrp: 1999,
    desc: 'Kaspersky Internet Security protection for 1 PC for 1 Year.',
    validity: '1 Year',
    features: ['Genuine Kaspersky License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'quick-heal-total-security-1y': {
    name: 'Quick Heal Total Security 1Y-1PC', price: 399, mrp: 1499,
    desc: 'Quick Heal Total Security protection for 1 PC for 1 Year.',
    validity: '1 Year',
    features: ['Genuine Quick Heal License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
};

interface PageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await api.get(`/products/${slug}`);
        setProduct(data);
      } catch {
        setProduct(fallbackProducts[slug] || null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  function addToCart() {
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart') || '[]'); } catch {}
    if (!Array.isArray(cart)) cart = [];
    const existing = cart.findIndex((i: any) => i.slug === slug);
    if (existing >= 0) {
      cart[existing].quantity += quantity;
    } else {
      cart.push({ slug, name: product?.name || slug, price: product?.price || 0, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart');
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
    </div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-pcd-text mb-4">Product Not Found</h1>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const totalPrice = product.price * quantity;
  const features = product.features || [
    'Genuine License Key',
    'Instant Email & WhatsApp Delivery',
    'GST Invoice Available',
    'Secure Payment',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-pcd-muted mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-pcd-text font-semibold">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border border-pcd-border rounded-2xl p-8 flex items-center justify-center">
          <div className="text-center">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-48 h-48 object-contain mx-auto mb-4" />
            ) : (
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
                {product.name.charAt(0)}
              </div>
            )}
            <p className="text-sm text-pcd-muted">{product.name}</p>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-pcd-text mb-2">{product.name}</h1>
          <p className="text-sm text-pcd-muted mb-4">{product.description || product.shortDescription || product.desc}</p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-extrabold text-primary">{formatPrice(product.price)}</span>
            <span className="text-lg text-pcd-muted line-through">{formatPrice(product.mrp)}</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-lg">{discount}% OFF</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-pcd-muted mb-4">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-500" /> Key delivery in 1 second</span>
            <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-blue-500" /> GST Invoice</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-500" /> Secure Payment</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <p className="text-xs text-amber-800 font-medium">GST of 18% is included in the price. You can claim Input Tax Credit.</p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-semibold text-pcd-text">Qty:</span>
            <div className="flex items-center border border-pcd-border rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-pcd-muted hover:text-pcd-text transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center py-2 text-sm font-semibold border-x border-pcd-border outline-none" />
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-pcd-muted hover:text-pcd-text transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Link href={`/checkout?product=${slug}&qty=${quantity}`} onClick={() => { let cart = []; try { cart = JSON.parse(localStorage.getItem('cart') || '[]'); } catch {} if (!Array.isArray(cart)) cart = []; const existing = cart.findIndex((i: any) => i.slug === slug); if (existing >= 0) { cart[existing].quantity = quantity; } else { cart.push({ slug, name: product?.name || slug, price: product?.price || 0, quantity }); } localStorage.setItem('cart', JSON.stringify(cart)); }} className="btn-primary flex-1">
              <Zap className="w-4 h-4" /> Buy Now
            </Link>
            <button onClick={addToCart} className="btn-outline flex-1">
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </div>

          <div className="bg-gray-50 border border-pcd-border rounded-xl p-4">
            <h3 className="text-sm font-bold text-pcd-text mb-3">Product Features</h3>
            <ul className="space-y-2">
              {features.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-pcd-muted">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white border border-pcd-border rounded-xl p-4 text-center">
          <Zap className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <h6 className="text-xs font-bold text-pcd-text">Instant Delivery</h6>
          <p className="text-[10px] text-pcd-muted">On Email & WhatsApp</p>
        </div>
        <div className="bg-white border border-pcd-border rounded-xl p-4 text-center">
          <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <h6 className="text-xs font-bold text-pcd-text">100% Genuine</h6>
          <p className="text-[10px] text-pcd-muted">Original License Keys</p>
        </div>
        <div className="bg-white border border-pcd-border rounded-xl p-4 text-center">
          <FileText className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <h6 className="text-xs font-bold text-pcd-text">GST Invoice</h6>
          <p className="text-[10px] text-pcd-muted">Claim Input Tax Credit</p>
        </div>
        <div className="bg-white border border-pcd-border rounded-xl p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <h6 className="text-xs font-bold text-pcd-text">Validity</h6>
          <p className="text-[10px] text-pcd-muted">{product.validity || 'Lifetime'}</p>
        </div>
      </div>
    </div>
  );
}
