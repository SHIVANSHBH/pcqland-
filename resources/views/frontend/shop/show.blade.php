@extends('layouts.app')

@section('title', $product->name . ' - PCQLand')

@push('styles')
<style>
.product-hero-section {
    background: linear-gradient(135deg, #e8f4fc 0%, #f5f9fc 50%, #ffffff 100%);
    padding: 10px 0;
    margin-bottom: 30px;
    border-radius: 14px;
}
.product-hero-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    gap: 30px;
}
.product-hero-image {
    flex: 0 0 45%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding-bottom: 12px;
}
.product-hero-image img {
    width: 50%;
    max-width: 320px;
    max-height: 280px;
    height: auto;
    aspect-ratio: 1.14/1;
    object-fit: contain;
    position: relative;
    z-index: 2;
}
.product-hero-info {
    flex: 0 0 50%;
    text-align: center;
    padding-left: 30px;
}
.product-hero-title {
    font-size: 22px;
    font-weight: 800;
    color: #1a1a1a;
    margin: 15px auto 8px auto;
    letter-spacing: 1px;
    text-align: center;
}

.pricing-section {
    max-width: 1200px;
    margin: 0 auto 30px auto;
    padding: 0 20px;
}
.pricing-cards-container {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    width: 100%;
    max-width: 100%;
}
.pricing-card {
    flex: 0 0 280px;
    width: 280px;
    max-width: 280px;
    min-width: 280px;
    height: 240px;
    min-height: 240px;
    max-height: 240px;
    background: linear-gradient(135deg, var(--card-main, #0f9cab) 0%, var(--card-dark, #0b7f8b) 100%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    color: #fff;
    display: flex;
    flex-direction: column;
}
.pricing-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}
.pricing-card.popular {
    border: 2px solid rgba(255, 255, 255, 0.7);
}
.pricing-card-header {
    padding: 12px 16px;
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    flex: 0 0 auto;
}
.pricing-card-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 5px;
    color: #fff;
}
.pricing-card-qty {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
}
.pricing-card-body {
    padding: 10px 14px 12px;
    position: relative;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 6px;
}
.pricing-card-price {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    margin-bottom: 4px;
}
.pricing-card-price .currency {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
}
.pricing-card-price .amount {
    font-size: 38px;
    font-weight: 700;
    color: #fff;
    line-height: 1;
}
.pricing-card-price .unit {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 400;
}
.pricing-card-savings {
    font-size: 13px;
    color: #fff;
    font-weight: 600;
    margin-bottom: 0;
    min-height: 18px;
    line-height: 1.2;
}
.pricing-card-btn {
    display: inline-block;
    padding: 9px 14px;
    border-radius: 25px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #fff;
    color: var(--card-dark, #0b7f8b);
    margin-top: 0;
    width: auto;
    white-space: nowrap;
    text-decoration: none;
}
.pricing-card-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
}

.quantity-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 20px;
    border-top: 1px solid #eee;
    background: #fff;
    border-radius: 14px;
    margin: 0 20px 30px;
}
.quantity-label {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}
.quantity-controls {
    display: flex;
    align-items: center;
    gap: 0;
}
.quantity-btn {
    width: 40px;
    height: 40px;
    background: #e0e0e0;
    border: none;
    font-size: 18px;
    font-weight: 700;
    color: #333;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}
.quantity-btn:first-child {
    border-radius: 8px 0 0 8px;
}
.quantity-btn:last-child {
    border-radius: 0 8px 8px 0;
}
.quantity-btn:hover {
    background: #d0d0d0;
}
.quantity-input {
    min-width: 60px;
    width: 72px;
    height: 40px;
    text-align: center;
    border: 1px solid #e0e0e0;
    border-left: none;
    border-right: none;
    font-size: 16px;
    font-weight: 600;
}
.quantity-input:focus {
    outline: none;
}
.main-buy-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 13px 46px 11px;
    min-height: 48px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    color: #fff;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.38);
    border-bottom: 1px solid rgba(0, 0, 0, 0.18);
    background: linear-gradient(180deg, #66d670 0%, #43a047 42%, #2e7d32 100%);
    box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.42),
        inset 0 -4px 10px rgba(0, 0, 0, 0.12),
        0 6px 0 rgba(17, 94, 40, 0.95),
        0 10px 22px rgba(0, 0, 0, 0.22);
    transform: translateY(0);
    transition: transform 0.14s ease, box-shadow 0.14s ease, filter 0.14s ease;
    text-decoration: none;
}
.main-buy-btn:hover:not(:disabled) {
    filter: brightness(1.06);
    transform: translateY(-2px);
    box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.48),
        inset 0 -3px 8px rgba(0, 0, 0, 0.1),
        0 9px 0 rgba(17, 94, 40, 0.98),
        0 14px 28px rgba(0, 0, 0, 0.26);
    color: #fff;
}
.main-buy-btn:active:not(:disabled) {
    filter: brightness(0.97);
    transform: translateY(5px);
    box-shadow:
        inset 0 4px 12px rgba(0, 0, 0, 0.22),
        inset 0 -1px 0 rgba(255, 255, 255, 0.15),
        0 2px 0 rgba(17, 94, 40, 0.75),
        0 5px 12px rgba(0, 0, 0, 0.18);
}

.product-tabs-section {
    max-width: 1200px;
    margin: 30px auto;
    padding: 0 20px;
}
.product-tabs-nav {
    display: flex;
    gap: 6px;
    border-radius: 14px;
    padding: 6px;
    margin-bottom: 0;
    border-bottom: none;
    background: #f1f5f9;
}
.product-tabs-nav .tab-link {
    padding: 12px 24px;
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
    text-decoration: none;
    border-radius: 10px;
    border-bottom: none;
    margin-bottom: 0;
    transition: all 0.25s ease;
    letter-spacing: 0.4px;
    white-space: nowrap;
    cursor: pointer;
    border: 0;
}
.product-tabs-nav .tab-link:hover {
    color: #1e293b;
    background: rgba(255,255,255,0.7);
}
.product-tabs-nav .tab-link.active {
    color: #1e40af;
    font-weight: 800;
    background: #ffffff;
    border-bottom: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
}
.tab-content-section {
    padding: 0;
    margin-top: 16px;
}
.tab-pane-inner {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    padding: 28px 28px 24px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.tab-pane-inner h4 {
    font-size: 17px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f1f5f9;
}
.tab-section-desc {
    font-size: 14px;
    line-height: 1.75;
    color: #475569;
}
.tab-section-desc ul { padding-left: 20px; margin-bottom: 10px; }

.gst-inclusive-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 999px;
    background: #ecf9e8;
    border: 1px solid #cfe8c7;
    color: #2f7d32;
    font-size: 11px;
    font-weight: 700;
    margin: 0 auto;
}
</style>
@endpush

@section('content')
<div class="page-shell py-4">
    <nav aria-label="breadcrumb" class="mb-3" style="padding:0 20px;">
        <ol class="breadcrumb" style="font-size:13px;">
            <li class="breadcrumb-item"><a href="{{ route('shop.index') }}" style="color:var(--pcd-green);text-decoration:none;">Shop</a></li>
            <li class="breadcrumb-item active" aria-current="page">{{ $product->name }}</li>
        </ol>
    </nav>

    <div class="product-hero-section">
        <div class="product-hero-container">
            <div class="product-hero-image">
                @if($product->image_path)
                    <img src="{{ $product->image_path }}" alt="{{ $product->name }}">
                @else
                    <img src="https://via.placeholder.com/300" alt="{{ $product->name }}">
                @endif
            </div>
            <div class="product-hero-info">
                <div class="product-hero-title">{{ $product->name }}</div>
                @if($product->short_description)
                    <p style="color:#475569;font-size:14px;margin:8px 0;">{{ $product->short_description }}</p>
                @endif
                <div style="margin-top:12px;">
                    <span class="gst-inclusive-pill"><i class="fa-solid fa-check-circle"></i> GST Inclusive</span>
                </div>
            </div>
        </div>
    </div>

    @if($product->priceSlabs && $product->priceSlabs->count() > 0)
    <div class="pricing-section">
        <div class="pricing-cards-container">
            @php
                $colors = [
                    ['--card-main: #0f9cab', '--card-dark: #0b7f8b'],
                    ['--card-main: #2196f3', '--card-dark: #1565c0'],
                    ['--card-main: #9c27b0', '--card-dark: #7b1fa2'],
                    ['--card-main: #e91e63', '--card-dark: #c2185b'],
                    ['--card-main: #ff5722', '--card-dark: #d84315'],
                ];
            @endphp
            @foreach($product->priceSlabs as $i => $slab)
                @php $style = implode(';', $colors[$i % count($colors)]); @endphp
                <div class="pricing-card {{ $slab->is_popular ? 'popular' : '' }}" style="{{ $style }};">
                    <div class="pricing-card-header">
                        <div class="pricing-card-label">{{ $slab->label ?? 'Qty ' . $slab->qty }}</div>
                        <div class="pricing-card-qty">Quantity: {{ $slab->qty }}</div>
                    </div>
                    <div class="pricing-card-body">
                        <div class="pricing-card-price">
                            <span class="currency">₹</span>
                            <span class="amount">{{ number_format($slab->unit_price, 0) }}</span>
                            <span class="unit">/ unit</span>
                        </div>
                        @php
                            $savings = $product->priceSlabs->first() && $slab->unit_price < $product->priceSlabs->first()->unit_price
                                ? $product->priceSlabs->first()->unit_price - $slab->unit_price
                                : 0;
                        @endphp
                        @if($savings > 0)
                            <div class="pricing-card-savings">Save ₹{{ number_format($savings * $slab->qty, 0) }}</div>
                        @else
                            <div class="pricing-card-savings">&nbsp;</div>
                        @endif
                        <form method="POST" action="{{ route('cart.add') }}">
                            @csrf
                            <input type="hidden" name="product_id" value="{{ $product->id }}">
                            <input type="hidden" name="qty" value="{{ $slab->qty }}">
                            <button type="submit" class="pricing-card-btn">BUY NOW</button>
                        </form>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
    @endif

    <form method="POST" action="{{ route('cart.add') }}" class="quantity-section" id="pcd-purchase-actions">
        @csrf
        <input type="hidden" name="product_id" value="{{ $product->id }}">
        <span class="quantity-label">Quantity:</span>
        <div class="quantity-controls">
            <button type="button" class="quantity-btn" onclick="var q=document.getElementById('buyQty');if(parseInt(q.value)>{{ $product->min_qty ?? 1 }})q.value=parseInt(q.value)-1;">−</button>
            <input type="number" name="qty" id="buyQty" value="{{ $product->min_qty ?? 1 }}" min="{{ $product->min_qty ?? 1 }}" max="{{ $product->max_qty ?? 999 }}" class="quantity-input">
            <button type="button" class="quantity-btn" onclick="var q=document.getElementById('buyQty');if(parseInt(q.value)<{{ $product->max_qty ?? 999 }})q.value=parseInt(q.value)+1;">+</button>
        </div>
        <button type="submit" class="main-buy-btn"><i class="fa-solid fa-cart-plus me-2"></i>Add to Cart</button>
    </form>

    <div class="product-tabs-section">
        <div class="product-tabs-nav" id="productTabsNav">
            <button class="tab-link active" data-tab="description">Description</button>
            <button class="tab-link" data-tab="features">Features</button>
            <button class="tab-link" data-tab="delivery">Delivery Info</button>
        </div>
        <div class="tab-content-section">
            <div class="tab-pane active" id="tab-description">
                <div class="tab-pane-inner">
                    <h4>Product Description</h4>
                    <div class="tab-section-desc">
                        @if($product->description_html)
                            {!! $product->description_html !!}
                        @else
                            <p>{{ $product->short_description ?? 'No description available.' }}</p>
                        @endif
                    </div>
                </div>
            </div>
            <div class="tab-pane" id="tab-features" style="display:none;">
                <div class="tab-pane-inner">
                    <h4>Key Features</h4>
                    <div class="tab-section-desc">
                        <ul>
                            <li>100% Genuine License Key</li>
                            <li>Lifetime Validity (one-time purchase, no subscription)</li>
                            <li>Instant Delivery via Email & WhatsApp</li>
                            <li>Easy Online Activation</li>
                            <li>GST Invoice Included</li>
                            <li>Free Technical Support</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="tab-pane" id="tab-delivery" style="display:none;">
                <div class="tab-pane-inner">
                    <h4>Delivery Information</h4>
                    <div class="tab-section-desc">
                        <p>Your license key will be delivered instantly via:</p>
                        <ul>
                            <li><strong>Email:</strong> Sent to your registered email address immediately after payment</li>
                            <li><strong>WhatsApp:</strong> Sent to your registered WhatsApp number</li>
                            <li><strong>My Orders:</strong> Available in your account under "My Orders" section</li>
                        </ul>
                        <p>If you don't receive the key within 5 minutes, please contact our support team.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
(function() {
    var tabs = document.querySelectorAll('#productTabsNav .tab-link');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            document.querySelectorAll('.tab-pane').forEach(function(p) { p.style.display = 'none'; });
            var target = document.getElementById('tab-' + this.dataset.tab);
            if (target) target.style.display = 'block';
        });
    });
})();
</script>
@endpush