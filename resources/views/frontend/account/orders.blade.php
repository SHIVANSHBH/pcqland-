@extends('layouts.app')

@section('title', 'My Orders - PCQLand')

@section('content')
<div class="page-shell py-4">
    <h1 style="font-weight:800;font-size:22px;margin-bottom:20px;">My Orders</h1>

    @if($orders->count() === 0)
        <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);padding:40px;text-align:center;">
            <p style="color:var(--pcd-muted);margin-bottom:16px;">No orders yet.</p>
            <a href="{{ route('shop.index') }}" class="btn" style="background:var(--pcd-green);color:#fff;border-radius:50px;font-weight:700;padding:10px 28px;border:0;">Start Shopping</a>
        </div>
    @else
        <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);overflow:hidden;">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Order No</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($orders as $order)
                        <tr>
                            <td><strong>{{ $order->order_no }}</strong></td>
                            <td>₹{{ number_format($order->total, 2) }}</td>
                            <td><span style="font-size:12px;padding:2px 8px;border-radius:20px;background:{{ $order->payment_status === 'paid' ? '#dcfce7' : '#fef3c7' }};color:{{ $order->payment_status === 'paid' ? '#16a34a' : '#d97706' }};">{{ ucfirst($order->payment_status) }}</span></td>
                            <td><span style="font-size:12px;padding:2px 8px;border-radius:20px;background:#e0f2fe;color:#0284c7;">{{ ucfirst($order->order_status) }}</span></td>
                            <td style="font-size:12px;color:var(--pcd-muted);">{{ $order->created_at->format('d M Y') }}</td>
                            <td><a href="{{ route('account.orders.show', $order->order_no) }}" style="color:var(--pcd-green);font-weight:600;font-size:13px;text-decoration:none;">View</a></td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        <div class="mt-3">{{ $orders->links() }}</div>
    @endif
</div>
@endsection
