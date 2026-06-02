'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Search, Shield, Percent, Box, Zap, FileText, Lock, Quote, Headphones, LifeBuoy, MessageCircle, Star, ChevronDown, ChevronUp } from 'lucide-react';

const categories = [
  { name: 'Super Saver Combo', slug: 'special-combo-offer', desc: 'View All Products' },
  { name: 'Windows', slug: 'windows-keys', desc: 'View All Products' },
  { name: 'Office', slug: 'microsoft-office-keys', desc: 'View All Products' },
  { name: 'MS Projects', slug: 'projects', desc: 'View All Products' },
  { name: 'Windows Server', slug: 'windows-server', desc: 'View All Products' },
  { name: 'MS Visio', slug: 'microsoft-visio', desc: 'View All Products' },
  { name: 'MS Visual Studio', slug: 'ms-visual-studio', desc: 'View All Products' },
  { name: 'NET PROTECTOR', slug: 'net-protector-keys', desc: 'View All Products' },
  { name: 'QUICK HEAL', slug: 'quick-heal', desc: 'View All Products' },
  { name: 'Anti Fraud', slug: 'anti-fraud', desc: 'View All Products' },
  { name: 'K7 KEYS', slug: 'k7-keys', desc: 'View All Products' },
  { name: 'GUARDIAN', slug: 'guardian-keys', desc: 'View All Products' },
  { name: 'KASPERSKY', slug: 'kaspersky-keys', desc: 'View All Products' },
  { name: 'ESET', slug: 'eset-keys', desc: 'View All Products' },
  { name: 'Mcafee', slug: 'mcafee', desc: 'View All Products' },
];

const heroSlides = [
  { image: '/assets/1748197776.1714020604.pcdeals-banner-1.jpg', alt: 'PC Deals India Banner' },
  { image: '/assets/1622030502.baner02.jpg', alt: 'Cashback Offer' },
  { image: '/assets/1622030789.baner01.jpg', alt: 'Software Keys' },
];

const brandIcons: Record<string, string> = {
  'special-combo-offer': '/assets/1776830587.MS win.png',
  'windows-keys': '/assets/1776830587.MS win.png',
  'microsoft-office-keys': '/assets/1776830389.microsoft-office-2019.png',
  'projects': '/assets/1776831162.ms project.png',
  'windows-server': '/assets/1777112945.MS win.png',
  'microsoft-visio': '/assets/1776831414.ms visio icon.png',
  'ms-visual-studio': '/assets/1776831481.Visual_Studio_Icon_2026.svg.png',
  'net-protector-keys': '/assets/1776832684.np av.jpg',
  'quick-heal': '/assets/1776831729.Quick Heal Icon.png',
  'anti-fraud': '/assets/1748147923.1746162050.Anti Fraud.jpg',
  'k7-keys': '/assets/1776757549.k7-removebg-preview.png',
  'guardian-keys': '/assets/1776920398.Guardian new 2.png',
  'kaspersky-keys': '/assets/1776920500.Kaspersky ICON.png',
  'eset-keys': '/assets/1776920604.ESET.jpg',
  'mcafee': '/assets/1776923944.mcafee icon.png',
};

const usps = [
  { icon: Shield, title: 'Lowest Price Guaranteed', desc: 'Guaranteed lowest price across India', bg: '#edf9e7', color: '#72b749' },
  { icon: Percent, title: 'Cashback & Discounts', desc: 'Enjoy 25% (max-500/-) cash back on your first order. Enjoy 2% special discount on prepaid card', bg: '#eaf3ff', color: '#4f89da' },
  { icon: Box, title: '100+ Antivirus & Microsoft Keys', desc: 'More than 100 antivirus & microsoft keys under one roof', bg: '#f1ebff', color: '#7a54d8' },
  { icon: Zap, title: 'Instant Delivery', desc: 'Key delivery on email and WhatsApp within seconds', bg: '#fff3df', color: '#ffad2f' },
  { icon: FileText, title: 'GST Invoice', desc: 'Receive your GST Invoice and Claim Input Tax Credit', bg: '#e7fbff', color: '#36b9d8' },
  { icon: Lock, title: 'Secure Payment', desc: '100% secure and encrypted payment gateway', bg: '#eaf1ff', color: '#3a7be0' },
];

const testimonials = [
  { name: 'Anthony Raj', location: 'Hassan, Karnataka', rating: 5, text: 'superb', date: 'May 20, 2026' },
  { name: 'PARVATESWARARAO', location: 'PEDDAPURAM, ANDHRA PRADESH', rating: 5, text: 'VERY GOOD SERVICE AND WONDERFULL PRODCT', date: 'May 19, 2026' },
  { name: 'DIGVIJAY SINGH', location: 'Muzaffarnagar, Uttar Pradesh', rating: 5, text: 'Very good service.', date: 'May 18, 2026' },
  { name: 'VYASTI ENTERPRISES', location: 'Hapur, Uttar Pradesh', rating: 5, text: 'BEST DEAL & GOOD SUPPORT', date: 'May 18, 2026' },
  { name: 'Rahul Mane', location: 'Karrad, MAHARASHTRA', rating: 5, text: 'बेस्ट', date: 'May 17, 2026' },
  { name: 'Surendrasingh', location: 'Mandya, Karnataka', rating: 5, text: 'veryy good and polite service', date: 'May 17, 2026' },
  { name: 'Siddharth Khobragade', location: 'Nagpur, Maharashtra', rating: 5, text: 'Good Service ..', date: 'May 16, 2026' },
  { name: 'chakravarthi', location: 'visakhapatnam, ANDHRA PRADESH', rating: 5, text: 'suuuuuppper', date: 'May 15, 2026' },
  { name: 'Mridul Chakraborty', location: 'Agartala, TRIPURA', rating: 5, text: 'delivered quickly I am satisfied', date: 'May 15, 2026' },
  { name: 'susanta pradhan', location: 'berhampur, Orissa', rating: 5, text: 'bahat hi achha service hai.', date: 'May 14, 2026' },
  { name: 'Hemant', location: 'Baramati, MAHARASHTRA', rating: 5, text: 'Best services', date: 'May 13, 2026' },
  { name: 'prakash', location: 'surat, Gujarat', rating: 5, text: 'best deal good', date: 'May 13, 2026' },
  { name: 'akash singh', location: 'jamshedpur, Jharkhand', rating: 5, text: 'good service', date: 'May 12, 2026' },
  { name: 'Monu kumar', location: 'Bijnor, UTTAR PRADESH', rating: 5, text: 'Nice product', date: 'May 9, 2026' },
  { name: 'Ankit Bansal', location: 'Hissar, HARYANA', rating: 5, text: 'Very Powerful', date: 'May 8, 2026' },
  { name: 'RANJITH PUNNATH', location: 'Malapuram, Kerala', rating: 5, text: 'nice shopping', date: 'May 7, 2026' },
  { name: 'Dinesh kumar', location: 'New delhi, DELHI', rating: 5, text: '🙏', date: 'May 7, 2026' },
  { name: 'MOHAN KUMAR M', location: 'ERODE, TAMIL NADU', rating: 5, text: 'Hi super fast your website', date: 'May 4, 2026' },
  { name: 'Ashish Awasthi', location: 'Baijnath, Himachal Pradesh', rating: 5, text: 'well done', date: 'Apr 30, 2026' },
];

const faqs = [
  { q: 'How to purchase on www.pcdealsindia.com?', a: 'Register yourself first and then select the company, click the product, select quantity, click buy now, click pay now, pay from different options displayed on the screen. After a successful payment, please check your WhatsApp or Email for the product key.' },
  { q: 'How would I get my invoice/bill?', a: 'Your GST invoice is uploaded in your account under "My Orders" tab on our website and app within 24 hours of your purchase. You can download it from there any time after that.' },
  { q: 'How will I get my key?', a: 'After the payment you will receive your key on your WhatsApp and Email within 1 second automatically. You don\'t need to call us for the key. You can see your key on our portal also under "my orders".' },
  { q: 'Will I get any box/cd/dvd for the product I have purchased?', a: 'No. You will receive the key only.' },
  { q: 'How much time it will take to get the key?', a: 'After the successful payment, you will receive your key within 1 second on your WhatsApp and Email. You can see your key on our portal under "my orders" also.' },
  { q: 'Whom do this site & app sells its products to? An end-user or a computer dealer?', a: 'Our website & app are used by computer dealers only. We at PC Deals India do not promote our website among end users.' },
  { q: 'Is GST included in the prices? Can we claim GST input credit on your invoice?', a: 'Yes. And anyone can claim GST input credit on our invoice. Period and all the relevant information is uploaded on the GST portal by us precisely in time.' },
  { q: 'Do you have any app also?', a: 'Yes. You can download it from Google Play Store by writing PC Deals India.' },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState('');
  const reviewTrackRef = useRef<HTMLDivElement>(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const nextReview = () => {
    setReviewIndex((prev) => Math.min(prev + 1, testimonials.length - 3));
  };

  const prevReview = () => {
    setReviewIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div>
      {/* Hero Slider */}
      <section className="px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gray-200 h-48 sm:h-72 md:h-96 lg:h-[400px]">
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image src={slide.image} alt={slide.alt} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-8 text-white">
                    <h2 className="text-2xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">
                      {i === 0 ? 'Smart Way to Buy Software Keys' : i === 1 ? 'Get Cashback on Every Order' : 'PC Deals India'}
                    </h2>
                    <Link href="/category/windows-keys" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 flex items-center justify-center text-gray-800 hover:bg-white transition-all shadow-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 flex items-center justify-center text-gray-800 hover:bg-white transition-all shadow-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white w-5' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="catalog-item">
                <span className="left">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Image src={brandIcons[cat.slug]} alt="" width={28} height={28} className="w-7 h-7 object-contain" />
                  </div>
                  <span>
                    <h6>{cat.name}</h6>
                    <p>{cat.desc}</p>
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-pcd-muted" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* USP Features */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="info-card-grid">
            {usps.map((usp, i) => {
              const Icon = usp.icon;
              return (
                <div key={i} className="info-card">
                  <div className="info-card-icon" style={{ background: usp.bg, color: usp.color }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h6>{usp.title}</h6>
                  <p>{usp.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="reviews-section">
        <div className="max-w-7xl mx-auto">
          <div className="reviews-head">
            <h3>Customer Reviews / Testimonials</h3>
          </div>
          <div className="reviews-frame">
            <button onClick={prevReview} className="review-nav" type="button" aria-label="Previous reviews">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="reviews-viewport">
              <div className="reviews-track" style={{ transform: `translateX(-${reviewIndex * 304}px)` }}>
                {testimonials.map((t, i) => (
                  <article key={i} className="review-card">
                    <div className="review-top">
                      <Quote className="w-6 h-6 text-primary/20" />
                      <span className="stars text-amber-400 text-sm">{'★'.repeat(t.rating)}</span>
                    </div>
                    <div className="review-body">
                      <div className="review-avatar" aria-hidden="true">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {t.name.charAt(0)}
                        </div>
                      </div>
                      <div className="review-content">
                        <h5>{t.text}</h5>
                        <p className="name">{t.name}</p>
                        <p className="meta">{t.location}</p>
                        <p className="date">{t.date}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <button onClick={nextReview} className="review-nav" type="button" aria-label="Next reviews">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="reviews-dots">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, i) => (
              <button key={i} onClick={() => setReviewIndex(i * 3)} className={i === Math.floor(reviewIndex / 3) ? 'active' : ''} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="info-faq-section px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="faq-shell">
            <div className="faq-support">
              <div className="faq-support-icon">
                <Headphones className="w-7 h-7" />
              </div>
              <h5>Still have questions?</h5>
              <p>Our support team is here to help you with delivery, invoice, wallet and product-related questions.</p>
              <Link href="/contact" className="support-btn">
                <LifeBuoy className="w-4 h-4" />
                Contact Support
              </Link>
              <a href="https://wa.me/919728622667?text=Hi%2C%20I%20need%20help%20with%20PC%20Deals%20India." target="_blank" rel="noopener noreferrer" className="wa-btn">
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="faq-panel">
              <div className="faq-panel-head">
                <h4>Frequently Asked <span>Questions</span></h4>
                <div className="faq-search">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pcd-muted" />
                  <input
                    type="search"
                    placeholder="Search your question..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-pcd-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredFaqs.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-pcd-text bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span>Q. {faq.q}</span>
                      {openFaq === i ? <ChevronUp className="w-4 h-4 text-pcd-muted" /> : <ChevronDown className="w-4 h-4 text-pcd-muted" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 py-3 text-sm text-pcd-muted bg-gray-50/50">
                        A. {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
