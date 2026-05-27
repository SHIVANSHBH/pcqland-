@extends('layouts.app')

@section('title', 'Checkout - PCQLand')

@section('content')
<div class="page-shell py-4">
    <h1 style="font-weight:800;font-size:22px;margin-bottom:20px;">Checkout</h1>

    @if(empty($cartItems) || count($cartItems) === 0)
        <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);padding:40px;text-align:center;">
            <p style="color:var(--pcd-muted);margin-bottom:16px;">Your cart is empty.</p>
            <a href="{{ route('shop.index') }}" class="btn" style="background:var(--pcd-green);color:#fff;border-radius:50px;font-weight:700;padding:10px 28px;border:0;">Browse Products</a>
        </div>
    @else
        <div class="row g-4">
            <div class="col-lg-8">
                <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);padding:24px;">
                    <h5 style="font-weight:700;font-size:15px;margin:0 0 16px;">Billing Details</h5>
                    <form method="POST" action="{{ route('checkout.create') }}">
                        @csrf
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label" style="font-weight:600;font-size:13px;">Name</label>
                                <input type="text" name="billing_name" class="form-control" required style="border-radius:10px;padding:10px 14px;">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" style="font-weight:600;font-size:13px;">Email</label>
                                <input type="email" name="billing_email" class="form-control" required style="border-radius:10px;padding:10px 14px;">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" style="font-weight:600;font-size:13px;">Phone</label>
                                <input type="text" name="billing_phone" class="form-control" required style="border-radius:10px;padding:10px 14px;">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" style="font-weight:600;font-size:13px;">Pincode</label>
                                <input type="text" name="billing_pincode" class="form-control" style="border-radius:10px;padding:10px 14px;">
                            </div>
                            <div class="col-md-12 mb-3">
                                <label class="form-label" style="font-weight:600;font-size:13px;">Address</label>
                                <textarea name="billing_address" class="form-control" rows="3" style="border-radius:10px;padding:10px 14px;"></textarea>
                            </div>
                        </div>
                        <button type="submit" class="btn w-100" style="background:var(--pcd-green);color:#fff;border-radius:50px;font-weight:700;padding:12px;border:0;">Place Order</button>
                    </form>
                </div>
            </div>
            <div class="col-lg-4">
                <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);padding:24px;">
                    <h5 style="font-weight:700;font-size:15px;margin:0 0 16px;">Order Summary</h5>
                    <ul style="list-style:none;padding:0;margin:0;">
                        @foreach($cartItems as $item)
                            <li style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--pcd-border);font-size:13px;">
                                <span>{{ $item['name'] }} × {{ $item['qty'] }}</span>
                                <span>₹{{ number_format($item['subtotal'], 2) }}</span>
                            </li>
                        @endforeach
                    </ul>
                    <div style="display:flex;justify-content:space-between;padding-top:12px;font-size:16px;font-weight:800;">
                        <span>Total</span>
                        <span>₹{{ number_format($cartTotal, 2) }}</span>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>
@endsection
