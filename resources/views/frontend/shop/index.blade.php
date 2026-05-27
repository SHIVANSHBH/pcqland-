@extends('layouts.app')

@section('title', ($selectedCategory ? $selectedCategory->name : 'Shop') . ' - PCQLand')

@push('styles')
<style>
.category-products > ul.products-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 20px;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
}
.category-products ul.products-grid li.item {
    float: none;
    width: auto;
    min-width: 0;
    margin: 0;
    padding: 0;
}
.category-products .item .item-inner {
    width: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 15px;
    border: 1px solid #e6e9ef;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s ease;
}
.category-products .item .item-inner:hover {
    box-shadow: 0 6px 14px rgba(0,0,0,0.1);
}
.category-products .item .item-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
}
.category-products .item .item-info .info-inner {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
}
.card-top {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 0;
}
.card-top .item-img {
    flex: 0 0 72px;
}
.card-top .item-img .item-img-info img {
    width: 72px;
    height: 72px;
    object-fit: contain;
    display: block;
}
.card-top-meta {
    flex: 1;
    min-width: 0;
}
.category-products .item .item-title a {
    font-size: 13px;
    font-weight: 700;
    line-height: 1.25;
    color: #101a40;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-decoration: none;
}
.category-products .item .item-title a:hover {
    color: var(--pcd-green);
}
.card-features {
    list-style: none;
    padding: 6px 8px;
    margin: 6px 0 0;
    background: #f0faf4;
    border-radius: 8px;
    border: 1px solid #c3e6d0;
}
.card-features li {
    font-size: 11.5px;
    color: #1a5c34;
    margin-bottom: 3px;
    position: relative;
    padding-left: 18px;
    line-height: 1.3;
    font-weight: 600;
}
.card-features li:last-child { margin-bottom: 0; }
.card-features li::before {
    content: "✔";
    position: absolute;
    left: 0;
    top: 2px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #00a651;
    color: #fff;
    font-size: 9px;
    line-height: 13px;
    text-align: center;
}
.category-products .item .item-price { margin-top: 0; }
.category-products .item .item-price .price-box .price {
    font-size: 18px;
    font-weight: 800;
    color: #0d1e40;
}
.category-products .item .item-price .price-box .regular-price {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    width: 100%;
}
.cashback-btn-offer {
    margin-top: 10px;
    padding: 9px 12px;
    border-radius: 10px;
    border: 1px solid #cddaf0;
    background: linear-gradient(135deg, #f6f9ff 0%, #ebf2ff 100%);
    font-size: 12px;
    font-weight: 700;
    color: #1f3b67;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-height: 44px;
    text-align: center;
}
.card-ui-controls { margin-top: 8px; display: flex; flex-direction: column; }
.card-view-btn {
    width: 100%;
    border-radius: 8px;
    font-weight: 700;
    font-size: 13px;
    text-align: center;
    display: block;
    padding: 9px 8px;
    margin-top: 6px;
    text-decoration: none;
    background: linear-gradient(135deg, #1a73e8 0%, #1a73e8 100%);
    border: 1px solid #1a73e8;
    color: #fff;
}
.card-view-btn:hover {
    background: linear-gradient(135deg, #1557c0 0%, #1557c0 100%);
    border-color: #1557c0;
    color: #fff;
}
.card-delivery-text {
    text-align: center;
    font-size: 12px;
    color: #6d7686;
    margin: 8px 0 0;
}
.shop-hero-banner {
    width: 100%;
    margin-bottom: 20px;
}
.shop-hero-banner img {
    width: 100%;
    border-radius: 18px;
    border: 1px solid #dbe3f2;
    box-shadow: 0 10px 30px rgba(7,33,66,0.14);
    max-height: min(52vh, 520px);
    object-fit: contain;
    background: linear-gradient(180deg, #f4f7fc 0%, #e8edf5 100%);
}
.shop-top-meta {
    background: #fff;
    border: 1px solid #dfe7f3;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 16px;
}
.shop-top-meta h2 {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    color: #10264d;
}
.shop-top-meta p {
    margin: 5px 0 0;
    color: #4a5f80;
    font-size: 13px;
}
.shop-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
}
.shop-sort {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}
.shop-sort label {
    font-size: 12px;
    font-weight: 700;
    color: #5e6f8d;
    margin: 0;
}
.shop-sort select {
    border: 1px solid #d4dfef;
    background: #fff;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    color: #344a72;
    height: 33px;
    padding: 0 10px;
    min-width: 130px;
}
.feature-strip {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #e1e7f2;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;
    margin-bottom: 16px;
}
.feature-strip-item {
    flex: 1 1 20%;
    min-width: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 10px;
    border-right: 1px solid #e9eef7;
}
.feature-strip-item:last-child { border-right: 0; }
.feature-strip-item i { color: #1b66d6; font-size: 18px; width: 22px; text-align: center; }
.feature-strip-item .feature-title { font-size: 13px; font-weight: 700; color: #1b2f5d; }
.feature-strip-item .feature-sub { font-size: 12px; color: #4c5b78; margin-top: 2px; }
.feature-green i { color: #16a34a; }

@media (max-width: 1200px) {
    .category-products > ul.products-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (max-width: 992px) {
    .category-products > ul.products-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
    .category-products > ul.products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .card-top .item-img { flex: 0 0 56px; }
    .card-top .item-img .item-img-info img { width: 56px; height: 56px; }
    .category-products .item .item-title a { font-size: 12px; }
    .category-products .item .item-price .price-box .price { font-size: 14px; }
    .shop-top-meta h2 { font-size: 22px; }
    .shop-controls { justify-content: flex-start; }
    .feature-strip-item { flex: 1 1 50%; border-bottom: 1px solid #e9eef7; }
    .feature-strip-item:nth-child(2n) { border-right: 0; }
    .feature-strip-item:nth-last-child(-n+2) { border-bottom: 0; }
    .shop-hero-banner img { max-height: min(32vh, 220px); border-radius: 12px; }
}
@media (max-width: 420px) {
    .category-products > ul.products-grid { gap: 8px; }
    .category-products .item .item-inner { padding: 10px; }
    .card-top .item-img { flex: 0 0 48px; }
    .card-top .item-img .item-img-info img { width: 48px; height: 48px; }
    .category-products .item .item-title a { font-size: 11px; }
    .category-products .item .item-price .price-box .price { font-size: 13px; }
}
</style>
@endpush

@section('content')
<div class="page-shell py-3">
    @if($selectedCategory && $selectedCategory->banner_path)
        <div class="shop-hero-banner">
            <img src="{{ $selectedCategory->banner_path }}" alt="{{ $selectedCategory->name }}">
        </div>
    @endif

    <div class="feature-strip">
        <div class="feature-strip-item">
            <i class="fa-solid fa-bolt"></i>
            <div>
                <div class="feature-title">Instant Delivery</div>
                <div class="feature-sub">Via Email &amp; WhatsApp</div>
            </div>
        </div>
        <div class="feature-strip-item feature-green">
            <i class="fa-regular fa-circle-check"></i>
            <div>
                <div class="feature-title">100% Genuine Keys</div>
                <div class="feature-sub">Original Licenses</div>
            </div>
        </div>
        <div class="feature-strip-item">
            <i class="fa-solid fa-shield-halved"></i>
            <div>
                <div class="feature-title">Secure Payment</div>
                <div class="feature-sub">Encrypted Checkout</div>
            </div>
        </div>
        <div class="feature-strip-item">
            <i class="fa-solid fa-headset"></i>
            <div>
                <div class="feature-title">Tech Support</div>
                <div class="feature-sub">Mon-Sat 11AM-7PM</div>
            </div>
        </div>
        <div class="feature-strip-item feature-green">
            <i class="fa-regular fa-file-lines"></i>
            <div>
                <div class="feature-title">GST Invoice</div>
                <div class="feature-sub">Business &amp; Individual</div>
            </div>
        </div>
    </div>

    <div class="shop-top-meta">
        <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
            <div>
                <div class="crumb-line" style="color:#5f7192;font-size:12px;margin-bottom:4px;font-weight:600;">
                    <a href="{{ route('home') }}" style="color:#1a73e8;text-decoration:none;">Home</a>
                    <span style="color:#7b8aa5;margin:0 6px;">/</span>
                    <span>{{ $selectedCategory ? $selectedCategory->name : 'All Products' }}</span>
                </div>
                <h2>{{ $selectedCategory ? $selectedCategory->name : 'All Products' }}</h2>
                @if($selectedCategory && $selectedCategory->description)
                    <p>{{ $selectedCategory->description }}</p>
                @endif
            </div>
            <div class="shop-controls">
                <form method="GET" action="{{ route('shop.index') }}" id="sortForm">
                    @if(request('category'))
                        <input type="hidden" name="category" value="{{ request('category') }}">
                    @endif
                    @if(request('search'))
                        <input type="hidden" name="search" value="{{ request('search') }}">
                    @endif
                    <div class="shop-sort">
                        <label for="sort">Sort:</label>
                        <select name="sort" id="sort" onchange="document.getElementById('sortForm').submit()">
                            <option value="">Latest</option>
                            <option value="price-asc" {{ request('sort') == 'price-asc' ? 'selected' : '' }}>Price: Low to High</option>
                            <option value="price-desc" {{ request('sort') == 'price-desc' ? 'selected' : '' }}>Price: High to Low</option>
                            <option value="name-asc" {{ request('sort') == 'name-asc' ? 'selected' : '' }}>Name: A-Z</option>
                            <option value="name-desc" {{ request('sort') == 'name-desc' ? 'selected' : '' }}>Name: Z-A</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="category-products">
        @if($products->count() > 0)
            <ul class="products-grid">
                @foreach($products as $product)
                    <li class="item">
                        <div class="item-inner">
                            <div class="item-info">
                                <div class="info-inner">
                                    <div class="card-top">
                                        <div class="item-img">
                                            <div class="item-img-info">
                                                <a href="{{ route('shop.product', $product->slug) }}">
                                                    <img src="{{ $product->image_path ?? 'https://via.placeholder.com/72' }}" alt="{{ $product->name }}">
                                                </a>
                                            </div>
                                        </div>
                                        <div class="card-top-meta">
                                            <div class="item-title">
                                                <a href="{{ route('shop.product', $product->slug) }}">{{ $product->name }}</a>
                                            </div>
                                        </div>
                                    </div>

                                    @if($product->features_json && count($product->features_json) > 0)
                                        <ul class="card-features">
                                            @foreach($product->features_json as $feature)
                                                <li>{{ $feature }}</li>
                                            @endforeach
                                        </ul>
                                    @endif

                                    <div class="item-content" style="margin-top:6px;">
                                        <div class="item-price">
                                            <div class="price-box">
                                                <span class="regular-price">
                                                    <span class="price">Rs. {{ number_format($product->base_price) }}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            @if($product->cashback_per_unit > 0)
                                <p class="cashback-btn-offer">
                                    <i class="fa-solid fa-wallet" style="color:#f59e0b;"></i>
                                    Use Cashback Wallet Amount ₹{{ number_format($product->cashback_per_unit) }}
                                </p>
                            @endif

                            <div class="card-ui-controls">
                                <a href="{{ route('shop.product', $product->slug) }}" class="card-view-btn">View Details</a>
                                <p class="card-delivery-text">Instant Delivery</p>
                            </div>
                        </div>
                    </li>
                @endforeach
            </ul>
        @else
            <div class="alert alert-info text-center py-4" style="border-radius:12px;">
                <i class="fa-solid fa-box-open fa-2x mb-2 d-block" style="color:#94a3b8;"></i>
                <h5 style="font-weight:700;color:#475569;">No products found</h5>
                <p style="color:#94a3b8;font-size:14px;">Try a different category or search term.</p>
                <a href="{{ route('shop.index') }}" class="btn" style="background:var(--pcd-green);color:#fff;border-radius:50px;font-weight:700;padding:8px 24px;font-size:13px;">View All Products</a>
            </div>
        @endif
    </div>

    @if($products->hasPages())
        <div class="mt-4 d-flex justify-content-center">
            {{ $products->links() }}
        </div>
    @endif
</div>
@endsection
