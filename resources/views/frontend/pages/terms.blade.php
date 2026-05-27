@extends('layouts.app')

@section('title', $pageTitle . ' - PCQLand')

@section('content')
<div class="page-shell py-4">
    <div class="static-page-card">
        <h1 class="static-page-title">{{ $pageTitle }}</h1>
        <div class="static-page-body">
            <h5>Terms of Service</h5>
            <p>By using PCQLand (operated by Shree Hira Computer & Communication), you agree to the following terms and conditions.</p>

            <h5>Products & Services</h5>
            <ul>
                <li>All software license keys sold are genuine digital activation keys.</li>
                <li>We do not sell physical media (CDs/DVDs) or boxes unless explicitly stated.</li>
                <li>License keys are for the version and quantity specified at the time of purchase.</li>
                <li>All prices are in Indian Rupees (INR) and inclusive of GST.</li>
            </ul>

            <h5>User Responsibilities</h5>
            <ul>
                <li>You must provide accurate billing and contact information.</li>
                <li>You must not attempt to resell, distribute, or misuse the license keys.</li>
                <li>You are responsible for maintaining the confidentiality of your account.</li>
            </ul>

            <h5>Limitation of Liability</h5>
            <p>Shree Hira Computer & Communication shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the purchased software keys. Our total liability is limited to the purchase amount paid.</p>

            <h5>Intellectual Property</h5>
            <p>All trademarks, logos, and product images displayed on our website are the property of their respective owners. Microsoft, Windows, Office, and other product names are trademarks of Microsoft Corporation and other respective owners.</p>

            <h5>Modifications</h5>
            <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date.</p>

            <h5>Governing Law</h5>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Hisar, Haryana.</p>

            <h5>Contact</h5>
            <p>For any questions regarding these terms, please <a href="{{ route('contact') }}">contact us</a>.</p>
        </div>
    </div>
</div>
@endsection