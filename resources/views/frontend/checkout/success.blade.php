@extends('layouts.app')

@section('title', 'Order Success - PCQLand')

@section('content')
<div class="page-shell py-5">
    <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);padding:48px 24px;text-align:center;">
        <div style="font-size:48px;color:var(--pcd-green);margin-bottom:16px;">
            <i class="fa-regular fa-circle-check"></i>
        </div>
        <h1 style="font-weight:800;font-size:24px;margin:0 0 8px;">Thank you for your order!</h1>
        <p style="color:var(--pcd-muted);margin-bottom:20px;">Your order has been received and is being processed.</p>
        <a href="{{ route('account.orders.index') }}" class="btn" style="background:var(--pcd-green);color:#fff;border-radius:50px;font-weight:700;padding:10px 28px;border:0;">View My Orders</a>
        <a href="{{ route('home') }}" class="btn" style="background:#fff;border:1px solid var(--pcd-border);border-radius:50px;font-weight:600;padding:10px 28px;margin-left:8px;">Back to Home</a>
    </div>
</div>
@endsection
