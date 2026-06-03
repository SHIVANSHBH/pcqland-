'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
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
  'win10-office2019-combo': {
    name: 'Windows 10 Pro + Office 2019 Pro Plus Combo', price: 2999, mrp: 35998,
    desc: 'Best value combo for businesses',
    validity: 'Lifetime',
    features: ['Both Genuine Microsoft Licenses', 'Lifetime Validity', 'Instant Delivery', 'GST Invoice Available'],
  },
  'win11-office-kaspersky-combo': {
    name: 'Windows 11 Pro + Office 2021 + Kaspersky Combo', price: 3999, mrp: 45997,
    desc: 'Ultimate combo with antivirus',
    validity: 'Lifetime',
    features: ['Genuine Licenses', 'Lifetime Validity', 'Antivirus Included', 'Instant Delivery', 'GST Invoice Available'],
  },
  'kaspersky-internet-security-1y': {
    name: 'Kaspersky Internet Security 1Y-1PC', price: 599, mrp: 1999,
    desc: 'Kaspersky Internet Security protection for 1 PC for 1 Year.',
    validity: '1 Year',
    features: ['Genuine Kaspersky License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'kaspersky-total-security-1y': {
    name: 'Kaspersky Total Security 1Y-3PC', price: 999, mrp: 2999,
    desc: 'Kaspersky Total Security - 1 Year / 3 PC',
    validity: '1 Year',
    features: ['Genuine Kaspersky License', '1 Year Validity', '3 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'kaspersky-total-security-5pc': {
    name: 'Kaspersky Total Security 1Y-5PC', price: 1499, mrp: 4999,
    desc: 'Kaspersky Total Security - 1 Year / 5 PC',
    validity: '1 Year',
    features: ['Genuine Kaspersky License', '1 Year Validity', '5 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'kaspersky-antivirus-1y': {
    name: 'Kaspersky Antivirus 1Y-1PC', price: 399, mrp: 1499,
    desc: 'Kaspersky Antivirus - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine Kaspersky License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'quick-heal-total-security-1y': {
    name: 'Quick Heal Total Security 1Y-1PC', price: 399, mrp: 1499,
    desc: 'Quick Heal Total Security protection for 1 PC for 1 Year.',
    validity: '1 Year',
    features: ['Genuine Quick Heal License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'quick-heal-internet-security-1y': {
    name: 'Quick Heal Internet Security 1Y-1PC', price: 299, mrp: 999,
    desc: 'Quick Heal Internet Security - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine Quick Heal License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'quick-heal-total-security-3pc': {
    name: 'Quick Heal Total Security 1Y-3PC', price: 699, mrp: 2499,
    desc: 'Quick Heal Total Security - 1 Year / 3 PC',
    validity: '1 Year',
    features: ['Genuine Quick Heal License', '1 Year Validity', '3 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'quick-heal-antivirus-pro-1y': {
    name: 'Quick Heal Antivirus Pro 1Y-1PC', price: 249, mrp: 799,
    desc: 'Quick Heal Antivirus Pro - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine Quick Heal License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'eset-nod32-1y': {
    name: 'ESET NOD32 Antivirus 1Y-1PC', price: 499, mrp: 1999,
    desc: 'ESET NOD32 Antivirus - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine ESET License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'eset-internet-security-1y': {
    name: 'ESET Internet Security 1Y-1PC', price: 799, mrp: 2999,
    desc: 'ESET Internet Security - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine ESET License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'eset-smart-security-1y': {
    name: 'ESET Smart Security Premium 1Y-1PC', price: 1199, mrp: 3999,
    desc: 'ESET Smart Security Premium - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine ESET License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'mcafee-total-protection-1y': {
    name: 'McAfee Total Protection 1Y-1PC', price: 599, mrp: 2499,
    desc: 'McAfee Total Protection - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine McAfee License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'mcafee-total-protection-5pc': {
    name: 'McAfee Total Protection 1Y-5PC', price: 999, mrp: 3999,
    desc: 'McAfee Total Protection - 1 Year / 5 PC',
    validity: '1 Year',
    features: ['Genuine McAfee License', '1 Year Validity', '5 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'mcafee-internet-security-1y': {
    name: 'McAfee Internet Security 1Y-1PC', price: 449, mrp: 1799,
    desc: 'McAfee Internet Security - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine McAfee License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'k7-total-security-1y': {
    name: 'K7 Total Security 1Y-1PC', price: 349, mrp: 1299,
    desc: 'K7 Total Security - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine K7 License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'k7-internet-security-1y': {
    name: 'K7 Internet Security 1Y-1PC', price: 249, mrp: 999,
    desc: 'K7 Internet Security - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine K7 License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'k7-antivirus-pro-1y': {
    name: 'K7 Antivirus Pro 1Y-1PC', price: 199, mrp: 699,
    desc: 'K7 Antivirus Pro - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine K7 License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'net-protector-1y': {
    name: 'Net Protector Antivirus 1Y-1PC', price: 299, mrp: 999,
    desc: 'Net Protector Antivirus - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine Net Protector License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'net-protector-total-security-1y': {
    name: 'Net Protector Total Security 1Y-1PC', price: 499, mrp: 1499,
    desc: 'Net Protector Total Security - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine Net Protector License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'guardian-antivirus-1y': {
    name: 'Guardian Antivirus 1Y-1PC', price: 249, mrp: 899,
    desc: 'Guardian Antivirus - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine Guardian License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'guardian-total-security-1y': {
    name: 'Guardian Total Security 1Y-1PC', price: 399, mrp: 1499,
    desc: 'Guardian Total Security - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine Guardian License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'anti-fraud-standard-1y': {
    name: 'Anti Fraud Standard 1Y-1PC', price: 349, mrp: 1299,
    desc: 'Anti Fraud Standard Protection - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'anti-fraud-premium-1y': {
    name: 'Anti Fraud Premium 1Y-1PC', price: 599, mrp: 1999,
    desc: 'Anti Fraud Premium Protection - 1 Year / 1 PC',
    validity: '1 Year',
    features: ['Genuine License', '1 Year Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'ms-project-2021-pro': {
    name: 'Microsoft Project Professional 2021', price: 4999, mrp: 39999,
    desc: 'Microsoft Project Professional 2021 License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'ms-project-2019-pro': {
    name: 'Microsoft Project Professional 2019', price: 3999, mrp: 34999,
    desc: 'Microsoft Project Professional 2019 License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'ms-project-2021-standard': {
    name: 'Microsoft Project Standard 2021', price: 3499, mrp: 29999,
    desc: 'Microsoft Project Standard 2021 License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'windows-server-2022-standard': {
    name: 'Windows Server 2022 Standard', price: 7999, mrp: 69999,
    desc: 'Windows Server 2022 Standard License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'windows-server-2019-standard': {
    name: 'Windows Server 2019 Standard', price: 6999, mrp: 59999,
    desc: 'Windows Server 2019 Standard License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'windows-server-2022-essentials': {
    name: 'Windows Server 2022 Essentials', price: 4999, mrp: 39999,
    desc: 'Windows Server 2022 Essentials License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'ms-visio-2021-pro': {
    name: 'Microsoft Visio Professional 2021', price: 3999, mrp: 34999,
    desc: 'Microsoft Visio Professional 2021 License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'ms-visio-2019-pro': {
    name: 'Microsoft Visio Professional 2019', price: 3499, mrp: 29999,
    desc: 'Microsoft Visio Professional 2019 License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'ms-visio-2021-standard': {
    name: 'Microsoft Visio Standard 2021', price: 2999, mrp: 24999,
    desc: 'Microsoft Visio Standard 2021 License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'ms-vs-2022-pro': {
    name: 'Microsoft Visual Studio 2022 Professional', price: 5499, mrp: 45999,
    desc: 'Microsoft Visual Studio 2022 Professional License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'ms-vs-2022-enterprise': {
    name: 'Microsoft Visual Studio 2022 Enterprise', price: 9999, mrp: 89999,
    desc: 'Microsoft Visual Studio 2022 Enterprise License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
  },
  'ms-vs-2019-pro': {
    name: 'Microsoft Visual Studio 2019 Professional', price: 4499, mrp: 39999,
    desc: 'Microsoft Visual Studio 2019 Professional License Key',
    validity: 'Lifetime',
    features: ['Genuine Microsoft License', 'Lifetime Validity', '1 PC License', 'Instant Delivery', 'GST Invoice Available'],
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
      cart.push({ _id: product?._id, slug, name: product?.name || slug, price: product?.price || 0, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart');
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-48 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-2xl h-80" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-10 bg-gray-100 rounded w-1/3" />
            <div className="h-12 bg-gray-100 rounded w-full" />
            <div className="h-32 bg-gray-100 rounded w-full" />
          </div>
        </div>
      </div>
    );
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
        <div className="bg-white border border-pcd-border rounded-2xl p-4 md:p-8 flex items-center justify-center">
          <div className="text-center">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.name} width={192} height={192} className="w-48 h-48 object-contain mx-auto mb-4" />
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
            <Link href={`/checkout?product=${slug}&qty=${quantity}`} onClick={() => { let cart = []; try { cart = JSON.parse(localStorage.getItem('cart') || '[]'); } catch {} if (!Array.isArray(cart)) cart = []; const existing = cart.findIndex((i: any) => i.slug === slug); if (existing >= 0) { cart[existing].quantity = quantity; } else { cart.push({ _id: product?._id, slug, name: product?.name || slug, price: product?.price || 0, quantity }); } localStorage.setItem('cart', JSON.stringify(cart)); }} className="btn-primary flex-1">
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
          <p className="text-[11px] text-pcd-muted">On Email & WhatsApp</p>
        </div>
        <div className="bg-white border border-pcd-border rounded-xl p-4 text-center">
          <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <h6 className="text-xs font-bold text-pcd-text">100% Genuine</h6>
          <p className="text-[11px] text-pcd-muted">Original License Keys</p>
        </div>
        <div className="bg-white border border-pcd-border rounded-xl p-4 text-center">
          <FileText className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <h6 className="text-xs font-bold text-pcd-text">GST Invoice</h6>
          <p className="text-[11px] text-pcd-muted">Claim Input Tax Credit</p>
        </div>
        <div className="bg-white border border-pcd-border rounded-xl p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <h6 className="text-xs font-bold text-pcd-text">Validity</h6>
          <p className="text-[11px] text-pcd-muted">{product.validity || 'Lifetime'}</p>
        </div>
      </div>
    </div>
  );
}
