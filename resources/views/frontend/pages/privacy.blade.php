@extends('layouts.app')

@section('title', $pageTitle . ' - PCQLand')

@section('content')
<div class="page-shell py-4">
    <div class="static-page-card">
        <h1 class="static-page-title">{{ $pageTitle }}</h1>
        <div class="static-page-body">
            <p>This Privacy Policy describes how Shree Hira Computer & Communication ("we", "us", or "our") collects, uses, and shares your personal information when you use our website and services.</p>

            <h5>Information We Collect</h5>
            <ul>
                <li><strong>Personal Information:</strong> Name, email address, phone number, billing address, and pincode provided during registration or checkout.</li>
                <li><strong>Order Information:</strong> Details of products purchased, order history, payment status.</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and browsing behavior on our site.</li>
            </ul>

            <h5>How We Use Your Information</h5>
            <ul>
                <li>To process and fulfill your orders (deliver license keys via email/WhatsApp).</li>
                <li>To generate GST invoices for your purchases.</li>
                <li>To provide customer support and respond to your inquiries.</li>
                <li>To improve our website and services.</li>
                <li>To send order-related communications (not marketing emails unless opted in).</li>
            </ul>

            <h5>Data Sharing</h5>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul>
                <li>Payment processors (e.g., Razorpay) to complete transactions.</li>
                <li>Government authorities as required by law (e.g., GST department).</li>
            </ul>

            <h5>Data Security</h5>
            <p>We implement industry-standard security measures including SSL encryption, secure data storage, and restricted access to personal information.</p>

            <h5>Your Rights</h5>
            <p>You may request access to, correction of, or deletion of your personal data by contacting us. We will respond within 30 days.</p>

            <h5>Contact</h5>
            <p>For privacy-related inquiries: <a href="mailto:shreehiracomputer@gmail.com">shreehiracomputer@gmail.com</a> or visit our <a href="{{ route('contact') }}">Contact Us</a> page.</p>

            <p class="mt-4" style="color:var(--pcd-muted);font-size:12px;">Last updated: May 2026</p>
        </div>
    </div>
</div>
@endsection