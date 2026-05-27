@extends('layouts.app')

@section('title', 'Pay with Razorpay - PCQLand')

@section('content')
<div class="page-shell py-5">
    <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);padding:48px 24px;text-align:center;">
        <h2 style="font-weight:800;font-size:24px;margin:0 0 8px;">Complete Payment</h2>
        <p style="color:var(--pcd-muted);margin-bottom:4px;">Order: <strong style="color:var(--pcd-green);">{{ $order->order_no }}</strong></p>
        <p style="font-size:20px;font-weight:800;margin-bottom:20px;">₹{{ number_format($order->total, 2) }}</p>
        <button id="pay-button" class="btn btn-lg" style="background:var(--pcd-green);color:#fff;border-radius:50px;font-weight:700;padding:12px 40px;border:0;">Pay Now</button>
    </div>
</div>

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
    document.getElementById('pay-button').addEventListener('click', function () {
        var options = {
            key: "{{ $razorpayKey }}",
            amount: "{{ $razorpayOrder['amount'] }}",
            currency: "{{ $razorpayOrder['currency'] }}",
            name: "PCQLand",
            description: "Order {{ $order->order_no }}",
            order_id: "{{ $razorpayOrder['id'] }}",
            handler: function (response) {
                var form = document.createElement('form');
                form.method = 'POST';
                form.action = '{{ route("payment.verify") }}';
                form.innerHTML = '@csrf' +
                    '<input name="razorpay_payment_id" value="' + response.razorpay_payment_id + '">' +
                    '<input name="razorpay_order_id" value="' + response.razorpay_order_id + '">' +
                    '<input name="razorpay_signature" value="' + response.razorpay_signature + '">';
                document.body.appendChild(form);
                form.submit();
            },
            modal: {
                ondismiss: function () {
                    alert('Payment cancelled. You can try again from your orders.');
                }
            },
            prefill: {
                email: "{{ $order->billing_json['email'] ?? '' }}",
                contact: "{{ $order->billing_json['phone'] ?? '' }}"
            },
            theme: {
                color: "#95c11f"
            }
        };
        var rzp = new Razorpay(options);
        rzp.open();
    });
</script>
@endsection
