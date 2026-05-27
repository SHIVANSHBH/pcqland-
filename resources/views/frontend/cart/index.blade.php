@extends('layouts.app')

@section('title', 'Cart - PCQLand')

@section('content')
<div class="page-shell py-4">
    <h1 style="font-weight:800;font-size:22px;margin-bottom:20px;">Shopping Cart</h1>

    @if(session('success'))
        <div class="alert alert-success py-2" style="font-size:13px;">{{ session('success') }}</div>
    @endif

    @if(empty($cartItems) || count($cartItems) === 0)
        <div style="background:#fff;border-radius:14px;border:1px solid var(--pcd-border);padding:40px;text-align:center;">
            <p style="color:var(--pcd-muted);margin-bottom:16px;">Your cart is empty.</p>
            <a href="{{ route('shop.index') }}" class="btn" style="background:var(--pcd-green);color:#fff;border-radius:50px;font-weight:700;padding:10px 28px;border:0;">Browse Products</a>
        </div>
    @else
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach($cartItems as $item)
                    <tr>
                        <td>
                            <div style="display:flex;align-items:center;gap:10px;">
                                <div>
                                    <strong style="font-size:13px;">{{ $item['name'] }}</strong>
                                    @if($item['price_slab'] ?? null)
                                        <br><small style="color:var(--pcd-muted);font-size:11px;">{{ $item['price_slab'] }}</small>
                                    @endif
                                </div>
                            </div>
                        </td>
                        <td>₹{{ number_format($item['unit_price'], 2) }}</td>
                        <td>
                            <form method="POST" action="{{ route('cart.update') }}" style="display:flex;align-items:center;gap:6px;">
                                @csrf
                                <input type="hidden" name="product_id" value="{{ $item['product_id'] }}">
                                <input type="number" name="qty" value="{{ $item['qty'] }}" min="0" style="width:60px;border-radius:8px;border:1px solid var(--pcd-border);padding:6px 8px;font-size:13px;">
                                <button type="submit" class="btn btn-sm" style="background:var(--pcd-green);color:#fff;border-radius:8px;border:0;padding:6px 12px;font-size:12px;font-weight:600;">Update</button>
                            </form>
                        </td>
                        <td><strong>₹{{ number_format($item['subtotal'], 2) }}</strong></td>
                        <td>
                            <form method="POST" action="{{ route('cart.remove') }}">
                                @csrf
                                <input type="hidden" name="product_id" value="{{ $item['product_id'] }}">
                                <button type="submit" class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border-radius:8px;border:0;padding:6px 12px;font-size:12px;font-weight:600;"><i class="fa-solid fa-trash-can"></i></button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;flex-wrap:wrap;gap:12px;">
            <form method="POST" action="{{ route('cart.clear') }}">
                @csrf
                <button type="submit" class="btn" style="background:#fff;border:1px solid var(--pcd-border);border-radius:50px;font-weight:600;padding:10px 20px;font-size:13px;">Clear Cart</button>
            </form>
            <div style="text-align:right;">
                <p style="font-size:18px;font-weight:800;margin:0;">Total: ₹{{ number_format($cartTotal, 2) }}</p>
                <a href="{{ route('checkout.index') }}" class="btn mt-2" style="background:var(--pcd-green);color:#fff;border-radius:50px;font-weight:700;padding:12px 32px;border:0;">Proceed to Checkout</a>
            </div>
        </div>
    @endif
</div>
@endsection
