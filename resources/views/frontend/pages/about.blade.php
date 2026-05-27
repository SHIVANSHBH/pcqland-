@extends('layouts.app')

@section('title', $pageTitle . ' - PCQLand')

@section('content')
<div class="page-shell py-4">
    <div class="static-page-card">
        <h1 class="static-page-title">{{ $pageTitle }}</h1>
        <div class="static-page-body">
            <h5>Welcome to PCQLand — Powered by Shree Hira Computer & Communication</h5>
            <p>PCQLand is a software license e-commerce platform operated by <strong>Shree Hira Computer & Communication</strong>, based in Hisar, Haryana. We specialize in providing genuine Microsoft Windows, Office, Server, and antivirus license keys at the most competitive prices in India.</p>

            <h5>Our Mission</h5>
            <p>To make genuine software licenses accessible and affordable for every Indian individual and business. We believe in 100% transparency, instant digital delivery, and unmatched customer support.</p>

            <h5>Why Choose Us?</h5>
            <ul>
                <li><strong>Lowest Price Guarantee</strong> — We continuously monitor the market to offer you the best prices.</li>
                <li><strong>Instant Delivery</strong> — Keys are delivered to your email and WhatsApp automatically within seconds.</li>
                <li><strong>100% Genuine Keys</strong> — All our licenses are sourced from authorized distributors.</li>
                <li><strong>GST Invoice</strong> — Every purchase includes a GST invoice for input tax credit.</li>
                <li><strong>Dedicated Support</strong> — Technical support via WhatsApp, email, and phone (Mon-Sat, 11 AM - 7 PM).</li>
            </ul>

            <h5>Our Story</h5>
            <p>Shree Hira Computer & Communication has been serving customers across India since 2015. What started as a small computer repair and software shop in Hisar has grown into one of India's most trusted online destinations for software license keys. Thousands of happy customers, from individual home users to large enterprises, rely on us for their software activation needs.</p>

            <p class="mt-4" style="color:var(--pcd-muted);font-size:13px;">For any inquiries, please <a href="{{ route('contact') }}" style="color:var(--pcd-green);">contact us</a>.</p>
        </div>
    </div>
</div>
@endsection