<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'PCQLand - Software License E-commerce')</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
    <link href="{{ asset('css/pcqland.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css">
    @stack('styles')
</head>
<body>
    <div class="home-shell py-2 py-md-3">
        <div class="top-strip">
            <div class="help">
                <i class="fa-solid fa-headset"></i>
                Technical Help? 98445-39000 &nbsp;|&nbsp; Sales: 97286-22667 (Mon - Sat, 11 AM - 7 PM)
            </div>
            <div class="benefits">
                <span><i class="fa-solid fa-truck-fast"></i> Instant Delivery</span>
                <span><i class="fa-regular fa-circle-check"></i> 100% Genuine Keys</span>
                <span><i class="fa-solid fa-shield-halved"></i> Secure Payment</span>
            </div>
        </div>

        <div class="main-head">
            <div class="row g-3 align-items-center">
                <div class="col-lg-2 col-md-3">
                    <div class="brand-support-row">
                        <a href="{{ route('home') }}">
                            <img class="brand" src="https://www.pcdealsindia.com/resources/assets/images/site_images/1565303531.shree hira computer Logo for WebSite.png" alt="PCQLand">
                        </a>
                        <div class="mobile-support-card">
                            <div class="mobile-support-line">Technical Help? 98445-39000 <br/> Sales: 97286-22667</div>
                            <div class="mobile-support-time">(Mon - Sat, 11 AM - 7 PM)</div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-7 col-md-6">
                    <form class="search-wrap" action="{{ route('shop.index') }}" method="get">
                        <div class="cat-picker" id="searchCategoryPicker">
                            <input type="hidden" name="category" id="searchCategoryValue" value="{{ request('category', 'all') }}">
                            <button type="button" class="cat-picker-toggle" id="searchCategoryToggle" aria-haspopup="listbox" aria-expanded="false">
                                <i class="fa-solid fa-layer-group"></i>
                                <span class="cat-current" id="searchCategoryCurrent">All Categories</span>
                                <i class="fa-solid fa-angle-down chevron"></i>
                            </button>
                            <div class="cat-picker-menu" id="searchCategoryMenu" role="listbox">
                                <button type="button" class="cat-option {{ request('category') ? '' : 'active' }}" data-value="all">All Categories</button>
                                @foreach($categories as $cat)
                                    <button type="button" class="cat-option {{ request('category') === $cat->slug ? 'active' : '' }}" data-value="{{ $cat->slug }}">{{ $cat->name }}</button>
                                @endforeach
                            </div>
                        </div>
                        <input class="search-input" type="search" name="search" placeholder="Search for products, software, keys..." value="{{ request('search') }}">
                        <button class="search-btn" type="submit" aria-label="Search"><i class="fa fa-search" aria-hidden="true"></i></button>
                    </form>
                </div>

                <div class="col-lg-3 col-md-3">
                    <div class="actions">
                        <button type="button" class="mobile-menu-btn" id="mobileMenuToggle" aria-label="Open menu" aria-controls="mobileSideMenu" aria-expanded="false">
                            <i class="fa-solid fa-bars"></i>
                        </button>

                        <div class="profile-menu">
                            @guest
                                <a class="profile-btn" href="{{ route('login') }}">
                                    <i class="fa-solid fa-user"></i>
                                    <span>Login / Register</span>
                                </a>
                            @else
                                <a class="profile-btn" href="{{ route('account.orders.index') }}">
                                    <i class="fa-solid fa-user"></i>
                                    <span>{{ Auth::user()->name }}</span>
                                </a>
                                <form method="POST" action="{{ route('logout') }}" class="d-inline">
                                    @csrf
                                    <button type="submit" class="profile-btn" style="border-color:transparent;background:transparent;">
                                        <i class="fa-solid fa-right-from-bracket"></i>
                                    </button>
                                </form>
                            @endguest
                        </div>
                    </div>
                </div>
            </div>

            <div class="category-strip" id="categoryStrip">
                <a class="all-btn" href="{{ route('home') }}"><i class="fa-solid fa-house me-2"></i>Home</a>
                @foreach($categories as $cat)
                    <div class="category-flyout {{ $cat->children->count() ? 'has-submenu' : '' }}">
                        <a class="category-link" href="{{ route('shop.index', ['category' => $cat->slug]) }}">
                            <span class="category-link-main">
                                @if($cat->icon_path)
                                    <img class="category-icon-img me-2" src="{{ $cat->icon_path }}" alt="{{ $cat->name }}">
                                @endif
                                <span>{{ $cat->name }}</span>
                            </span>
                            @if($cat->children->count())
                                <i class="fa-solid fa-angle-down category-link-arrow" aria-hidden="true"></i>
                            @endif
                        </a>
                        @if($cat->children->count())
                            <div class="category-submenu">
                                <div class="category-submenu-head">
                                    <span class="category-submenu-label">Explore</span>
                                    <a class="category-submenu-title" href="{{ route('shop.index', ['category' => $cat->slug]) }}">{{ $cat->name }}</a>
                                </div>
                                <div class="category-submenu-grid">
                                    @foreach($cat->children as $child)
                                        <a class="category-submenu-item" href="{{ route('shop.index', ['category' => $child->slug]) }}">
                                            <span class="category-submenu-dot"></span>
                                            <span>{{ $child->name }}</span>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>

        <div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
        <aside class="mobile-side-menu" id="mobileSideMenu" aria-hidden="true">
            <div class="mobile-side-menu-head">
                <h5>Menu</h5>
                <button type="button" class="mobile-side-menu-close" id="mobileMenuClose" aria-label="Close menu">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="mobile-side-menu-content">
                <div class="mobile-category-list">
                    <h6>Browse Categories</h6>
                    <a href="{{ route('home') }}"><i class="fa-solid fa-house"></i>Home</a>
                    @foreach($categories as $cat)
                        @if($cat->children->count())
                            <div class="mobile-cat-item has-children">
                                <div class="mobile-cat-head">
                                    <a class="mobile-cat-link" href="{{ route('shop.index', ['category' => $cat->slug]) }}">
                                        @if($cat->icon_path)
                                            <img class="category-icon-img" src="{{ $cat->icon_path }}" alt="{{ $cat->name }}">
                                        @endif
                                        <span>{{ $cat->name }}</span>
                                    </a>
                                    <button type="button" class="mobile-cat-toggle" aria-expanded="false" aria-label="Toggle {{ $cat->name }} sub categories">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                                <div class="mobile-subcat-list" style="display:none;">
                                    @foreach($cat->children as $child)
                                        <a href="{{ route('shop.index', ['category' => $child->slug]) }}">
                                            <span style="width:5px;height:5px;border-radius:50%;background:#7eb114;display:inline-block;margin-right:8px;"></span>
                                            {{ $child->name }}
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        @else
                            <a href="{{ route('shop.index', ['category' => $cat->slug]) }}">
                                @if($cat->icon_path)
                                    <img class="category-icon-img" src="{{ $cat->icon_path }}" alt="{{ $cat->name }}">
                                @endif
                                {{ $cat->name }}
                            </a>
                        @endif
                    @endforeach
                </div>
            </div>
        </aside>
    </div>

    @yield('content')

    <footer class="home-footer">
        <div class="home-footer-grid">
            <div>
                <h5><i class="fa-solid fa-briefcase"></i>Quick Links</h5>
                <ul class="footer-links">
                    <li><a href="{{ route('home') }}"><span class="left"><i class="fa-solid fa-house"></i>Home</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="{{ route('shop.index') }}"><span class="left"><i class="fa-solid fa-store"></i>Shop</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="{{ route('cart.index') }}"><span class="left"><i class="fa-solid fa-cart-shopping"></i>Cart</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="{{ route('reviews') }}"><span class="left"><i class="fa-regular fa-star"></i>Review Us</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="{{ route('cid') }}"><span class="left"><i class="fa-solid fa-key"></i>Get CID</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="{{ route('contact') }}"><span class="left"><i class="fa-regular fa-address-book"></i>Contact Us</span><i class="fa-solid fa-angle-right go"></i></a></li>
                </ul>
                <div class="footer-qr">
                    <img src="https://www.pcdealsindia.com/public/new/images/qr.jpg" alt="Contact QR">
                    <div>
                        <h6>Scan to Contact Us</h6>
                        <p>Quick support on WhatsApp.</p>
                    </div>
                </div>
            </div>

            <div>
                <h5><i class="fa-solid fa-circle-info"></i>Information</h5>
                <ul class="footer-links">
                    <li><a href="{{ route('page', ['name' => 'ABOUT-US']) }}"><span class="left"><i class="fa-regular fa-user"></i>About Us</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="{{ route('page', ['name' => 'Privacy-Policy-New']) }}"><span class="left"><i class="fa-regular fa-shield"></i>Privacy Policy</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="{{ route('page', ['name' => 'SHIPPING-RETURN']) }}"><span class="left"><i class="fa-solid fa-truck"></i>Shipping & Return</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="{{ route('page', ['name' => 'TC-And-Disclaimer']) }}"><span class="left"><i class="fa-regular fa-file-lines"></i>T&C and Disclaimer</span><i class="fa-solid fa-angle-right go"></i></a></li>
                </ul>
                <div class="footer-trust-mini">
                    <div><i class="fa-solid fa-lock"></i><p>100% Secure Checkout</p></div>
                    <div><i class="fa-regular fa-circle-check"></i><p>Original Keys</p></div>
                    <div><i class="fa-solid fa-bolt"></i><p>Instant Delivery</p></div>
                    <div><i class="fa-solid fa-headset"></i><p>Technical Support</p></div>
                </div>
            </div>

            <div>
                <h5><i class="fa-solid fa-share-nodes"></i>Follow Us</h5>
                <ul class="footer-links social">
                    <li><a href="https://www.facebook.com/Pcdealsindiaantiviruskeys/?ti=as" target="_blank" rel="noopener"><span class="left"><i style="--social-color: #1877f2" class="fa-brands fa-facebook-f"></i>Facebook</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="https://www.instagram.com/pcdealsindia" target="_blank" rel="noopener"><span class="left"><i style="--social-color: #e4405f" class="fa-brands fa-instagram"></i>Instagram</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="https://twitter.com/pcdealsindia" target="_blank" rel="noopener"><span class="left"><i style="--social-color: #1da1f2" class="fa-brands fa-x-twitter"></i>Twitter</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="https://www.linkedin.com/company/75654995" target="_blank" rel="noopener"><span class="left"><i style="--social-color: #0a66c2" class="fa-brands fa-linkedin-in"></i>LinkedIn</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="https://www.youtube.com/pcdealsindia" target="_blank" rel="noopener"><span class="left"><i style="--social-color: #ff0000" class="fa-brands fa-youtube"></i>YouTube</span><i class="fa-solid fa-angle-right go"></i></a></li>
                    <li><a href="https://www.indiamart.com/shreehiracomputer/" target="_blank" rel="noopener"><span class="left"><i style="--social-color: #d71a24" class="fa-brands fa-shop"></i>IndiaMart</span><i class="fa-solid fa-angle-right go"></i></a></li>
                </ul>
            </div>
        </div>

        <div class="home-footer-bottom">
            <div class="home-footer-text">
                <p class="home-footer-copy trademark-text">
                    All trademarks, logos, and product images are the property of their respective owners.
                </p>
                <p class="home-footer-copy copyright-text">
                    &copy; {{ date('Y') }} Shree Hira Computer &amp; Communication. All Rights Reserved.
                </p>
            </div>
            <div class="home-footer-pay">
                <img src="https://www.pcdealsindia.com/public/new/images/payment-2.png" alt="Payment 2">
                <img src="https://www.pcdealsindia.com/public/new/images/payment-3.png" alt="Payment 3">
                <img src="https://www.pcdealsindia.com/public/new/images/payment-4.png" alt="Payment 4">
            </div>
        </div>

        <a class="footer-float-wa" href="https://api.whatsapp.com/send?phone=919728622667&text=Hi%2C%20I%20need%20help%20with%20PC%20Deals%20India." target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
            <i class="fa-brands fa-whatsapp"></i>
        </a>
    </footer>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js"></script>
    <script>
        (function() {
            var toggle = document.getElementById('mobileMenuToggle');
            var menu = document.getElementById('mobileSideMenu');
            var overlay = document.getElementById('mobileMenuOverlay');
            var closeBtn = document.getElementById('mobileMenuClose');

            function openMenu() {
                menu.classList.add('open');
                overlay.classList.add('open');
                toggle.setAttribute('aria-expanded', 'true');
            }

            function closeMenu() {
                menu.classList.remove('open');
                overlay.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }

            toggle?.addEventListener('click', function() {
                if (menu.classList.contains('open')) { closeMenu(); } else { openMenu(); }
            });
            closeBtn?.addEventListener('click', closeMenu);
            overlay?.addEventListener('click', closeMenu);

            document.querySelectorAll('.mobile-cat-toggle').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var item = this.closest('.mobile-cat-item');
                    var list = item ? item.querySelector('.mobile-subcat-list') : null;
                    var icon = this.querySelector('i');
                    var open = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', open ? 'false' : 'true');
                    if (list) { list.style.display = open ? 'none' : 'block'; }
                    if (item) {
                        if (open) { item.classList.remove('is-open'); } else { item.classList.add('is-open'); }
                    }
                    if (icon) {
                        icon.style.transform = open ? 'rotate(0deg)' : 'rotate(45deg)';
                        icon.style.transition = 'transform 0.2s ease';
                    }
                });
            });

            var catToggle = document.getElementById('searchCategoryToggle');
            var catMenu = document.getElementById('searchCategoryMenu');
            var catValue = document.getElementById('searchCategoryValue');
            var catCurrent = document.getElementById('searchCategoryCurrent');

            if (catToggle && catMenu) {
                catToggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
                    this.setAttribute('aria-expanded', expanded);
                    catMenu.classList.toggle('show');
                });

                catMenu.querySelectorAll('.cat-option').forEach(function(opt) {
                    opt.addEventListener('click', function() {
                        catMenu.querySelectorAll('.cat-option').forEach(function(o) { o.classList.remove('active'); });
                        this.classList.add('active');
                        catValue.value = this.getAttribute('data-value');
                        catCurrent.textContent = this.textContent;
                        catToggle.setAttribute('aria-expanded', 'false');
                        catMenu.classList.remove('show');
                    });
                });

                document.addEventListener('click', function(e) {
                    if (!catToggle.contains(e.target) && !catMenu.contains(e.target)) {
                        catToggle.setAttribute('aria-expanded', 'false');
                        catMenu.classList.remove('show');
                    }
                });
            }
        })();
    </script>
    @stack('scripts')
</body>
</html>
