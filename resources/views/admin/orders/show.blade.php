@extends('layouts.admin')

@section('title', 'Order Details - PCQLand Admin')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="h3">Order {{ $order->order_no }}</h1>
            <p class="text-muted">Placed on {{ $order->created_at->format('d M Y H:i') }}</p>
        </div>
        <a href="{{ route('admin.orders.index') }}" class="btn btn-secondary">Back to Orders</a>
    </div>

    <div class="row gy-4">
        <div class="col-lg-8">
            <div class="card mb-4">
                <div class="card-header">Customer & Billing Details</div>
                <div class="card-body">
                    <p><strong>Name:</strong> {{ optional($order->user)->name ?? 'Guest' }}</p>
                    <p><strong>Email:</strong> {{ optional($order->user)->email ?? 'N/A' }}</p>
                    <p><strong>Order total:</strong> ₹{{ number_format($order->total, 2) }}</p>
                    <p><strong>Payment status:</strong> {{ ucfirst($order->payment_status) }}</p>
                    <p><strong>Order status:</strong> {{ ucfirst($order->order_status) }}</p>

                    @if($order->billing_json)
                        <h6 class="mt-3">Billing Data</h6>
                        <ul class="list-unstyled">
                            @foreach($order->billing_json as $key => $value)
                                <li><strong>{{ ucwords(str_replace('_', ' ', $key)) }}:</strong> {{ is_array($value) ? json_encode($value) : $value }}</li>
                            @endforeach
                        </ul>
                    @endif
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header">Order Items</div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
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
            </div>
        </div>

        <div class="col-lg-4">
            <div class="card">
                <div class="card-header">Update Status</div>
                <div class="card-body">
                    <form method="POST" action="{{ route('admin.orders.status.update', $order) }}">
                        @csrf
                        <div class="mb-3">
                            <label class="form-label">Order Status</label>
                            <select name="order_status" class="form-select">
                                @foreach(['pending','processing','completed','cancelled','refunded'] as $status)
                                    <option value="{{ $status }}" {{ $order->order_status === $status ? 'selected' : '' }}>{{ ucfirst($status) }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Payment Status</label>
                            <select name="payment_status" class="form-select">
                                @foreach(['pending','paid','failed','refunded'] as $status)
                                    <option value="{{ $status }}" {{ $order->payment_status === $status ? 'selected' : '' }}>{{ ucfirst($status) }}</option>
                                @endforeach
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
