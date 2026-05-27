@extends('layouts.app')

@section('title', $pageTitle . ' - PCQLand')

@section('content')
<div class="page-shell py-4">
    <div class="static-page-card">
        <h1 class="static-page-title">{{ $pageTitle }}</h1>
        <div class="static-page-body">
            <h5>Delivery Policy</h5>
            <p>All software license keys are delivered <strong>instantly</strong> via email and WhatsApp immediately after successful payment confirmation. No physical shipping is involved as all products are digital license keys.</p>

            <h5>Return Policy</h5>
            <p>Due to the digital nature of our products, license keys cannot be returned or exchanged once the key has been revealed or delivered. Please ensure you select the correct product before purchasing.</p>

            <h5>Cancellation Policy</h5>
            <p>Orders can be cancelled only before the license key has been delivered. Once the key is sent (automatically upon payment), cancellations are not possible.</p>

            <h5>Refund Policy</h5>
            <p>Refunds are considered on a case-by-case basis under the following circumstances:</p>
            <ul>
                <li>Technical issues with the key that cannot be resolved by our support team within 7 days.</li>
                <li>Duplicate purchase or accidental order (if reported before key delivery).</li>
                <li>Wrong product delivered due to our error.</li>
            </ul>
            <p>Refund requests must be submitted via email or contact form within 7 days of purchase. Processing time is 5-7 business days after approval.</p>

            <h5>Key Activation Support</h5>
            <p>If you face any issues during activation, our technical support team will assist you via WhatsApp or email at no extra cost. We guarantee activation or replacement of non-working keys.</p>

            <h5>GST Invoice</h5>
            <p>A GST invoice is generated and uploaded to your account within 24 hours of purchase. You can download it from the "My Orders" section. All prices are inclusive of GST.</p>
        </div>
    </div>
</div>
@endsection