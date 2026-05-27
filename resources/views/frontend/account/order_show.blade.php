@extends('layouts.app')

@section('title', 'Order #' . $order->order_no . ' - PCQLand')

@section('content')
<div class="page-shell py-4">
    <a href="{{ route('account.orders.index') }}" style="color:var(--pcd-green);font-size:13px;font-weight:600;text-decoration:none;display:inline-block;margin-bottom:16px;">&larr; Back to Orders</a>

    <h1 style="font-weight:800;font-size:22px;margin-bottom:20px;">Order #{{ $order->order_no }}</h1>

    <div class="row g-4">
        <div class="col-lg-8">
            <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);padding:24px;">
                <h5 style="font-weight:700;font-size:15px;margin:0 0 16px;">Items</h5>
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($order->items as $item)
                            <tr>
                                <td>{{ $item->product_name_snapshot }}</td>
                                <td>{{ $item->qty }}</td>
                                <td>₹{{ number_format($item->unit_price, 2) }}</td>
                                <td>₹{{ number_format($item->total, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-lg-4">
            <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);padding:24px;">
                <h5 style="font-weight:700;font-size:15px;margin:0 0 16px;">Details</h5>

                <div style="font-size:13px;">
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--pcd-border);">
                        <span style="color:var(--pcd-muted);">Payment</span>
                        <span style="font-weight:600;">{{ ucfirst($order->payment_status) }}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--pcd-border);">
                        <span style="color:var(--pcd-muted);">Status</span>
                        <span style="font-weight:600;">{{ ucfirst($order->order_status) }}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--pcd-border);">
                        <span style="color:var(--pcd-muted);">Subtotal</span>
                        <span>₹{{ number_format($order->subtotal, 2) }}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:16px;font-weight:800;">
                        <span>Total</span>
                        <span>₹{{ number_format($order->total, 2) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
