@extends('layouts.app')

@section('title', 'PCQLand - Software License E-commerce')

@section('content')
<div class="home-shell pb-2 pb-md-3">
    <div class="main-head">
        <section class="hero">
            <div id="homeHeroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#homeHeroCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#homeHeroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#homeHeroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <div class="carousel-link" role="img" aria-label="Smart way">
                            <img src="https://www.pcdealsindia.com/resources/assets/images/banner_images/1622030789.baner01.jpg" alt="Smart way">
                        </div>
                    </div>
                    <div class="carousel-item">
                        <div class="carousel-link" role="img" aria-label="Cash back">
                            <img src="https://www.pcdealsindia.com/resources/assets/images/banner_images/1622030502.baner02.jpg" alt="Cash back">
                        </div>
                    </div>
                    <div class="carousel-item">
                        <div class="carousel-link" role="img" aria-label="Pcdeals">
                            <img src="https://www.pcdealsindia.com/resources/assets/images/banner_images/1748197776.1714020604.pcdeals-banner-1.jpg" alt="Pcdeals">
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#homeHeroCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#homeHeroCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </section>

        <div class="catalog-grid">
            @foreach($categories->take(6) as $category)
                <a class="catalog-item" href="{{ route('shop.index', ['category' => $category->slug]) }}">
                    <span class="left">
                        @if($category->icon_path)
                            <img class="category-icon-img" src="{{ $category->icon_path }}" alt="{{ $category->name }}">
                        @endif
                        <span>
                            <h6>{{ $category->name }}</h6>
                            <p>View All Products</p>
                        </span>
                    </span>
                    <i class="fa-solid fa-chevron-right"></i>
                </a>
            @endforeach
        </div>

        <section class="reviews-section" id="homeReviewsSection">
            <div class="reviews-head">
                <h3>Customer Reviews / Testimonials</h3>
            </div>
            <div class="reviews-frame">
                <button class="review-nav prev" type="button" id="reviewPrevBtn" aria-label="Previous reviews">
                    <i class="fa-solid fa-angle-left"></i>
                </button>
                <div class="reviews-viewport">
                    <div class="reviews-track" id="reviewsTrack">
                        @forelse($reviews as $review)
                            <article class="review-card">
                                <div class="review-top">
                                    <i class="fa-solid fa-quote-left quote"></i>
                                    <span class="stars">★★★★★</span>
                                </div>
                                <div class="review-body">
                                    <div class="review-avatar" aria-hidden="true">
                                        <span class="avatar-orbit"></span>
                                        <span class="avatar-character">
                                            <span class="avatar-hair"></span>
                                            <span class="avatar-face">
                                                <span class="avatar-eye left"></span>
                                                <span class="avatar-eye right"></span>
                                                <span class="avatar-smile"></span>
                                            </span>
                                            <span class="avatar-shirt"></span>
                                        </span>
                                    </div>
                                    <div class="review-content">
                                        <h5>{{ $review->description }}</h5>
                                        <p class="name">{{ $review->name }}</p>
                                        <p class="meta">{{ $review->city }}, {{ $review->state }}</p>
                                        <p class="date">{{ $review->created_at->format('M d, Y') }}</p>
                                    </div>
                                </div>
                            </article>
                        @empty
                            <p style="color:var(--pcd-muted);padding:20px;">No reviews yet.</p>
                        @endforelse
                    </div>
                </div>
                <button class="review-nav next" type="button" id="reviewNextBtn" aria-label="Next reviews">
                    <i class="fa-solid fa-angle-right"></i>
                </button>
            </div>
            <div class="reviews-dots" id="reviewsDots"></div>
        </section>

        <section class="info-faq-section">
            <div class="info-card-grid">
                <div class="info-card">
                    <div class="info-card-icon" style="background: #edf9e7; color: #72b749;">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <h6>Lowest Price Guaranteed</h6>
                    <p>Guaranteed lowest price across India</p>
                </div>
                <div class="info-card">
                    <div class="info-card-icon" style="background: #eaf3ff; color: #4f89da;">
                        <i class="fa-solid fa-percent"></i>
                    </div>
                    <h6>Cashback & Discounts</h6>
                    <p>Enjoy 25% (max-500/-) cash back on your first order.<br>Enjoy 2% special discount on prepaid card</p>
                </div>
                <div class="info-card">
                    <div class="info-card-icon" style="background: #f1ebff; color: #7a54d8;">
                        <i class="fa-solid fa-cubes"></i>
                    </div>
                    <h6>100+ Antivirus & Microsoft Keys</h6>
                    <p>More than 100 antivirus & microsoft keys under one roof</p>
                </div>
                <div class="info-card">
                    <div class="info-card-icon" style="background: #fff3df; color: #ffad2f;">
                        <i class="fa-solid fa-bolt"></i>
                    </div>
                    <h6>Instant Delivery</h6>
                    <p>Key delivery on email and WhatsApp within seconds</p>
                </div>
                <div class="info-card">
                    <div class="info-card-icon" style="background: #e7fbff; color: #36b9d8;">
                        <i class="fa-solid fa-file-invoice"></i>
                    </div>
                    <h6>GST Invoice</h6>
                    <p>Receive your GST Invoice and Claim Input Tax Credit</p>
                </div>
                <div class="info-card">
                    <div class="info-card-icon" style="background: #eaf1ff; color: #3a7be0;">
                        <i class="fa-solid fa-shield"></i>
                    </div>
                    <h6>Secure Payment</h6>
                    <p>100% secure and encrypted payment gateway</p>
                </div>
            </div>

            <div class="faq-shell">
                <div class="faq-support">
                    <div class="faq-support-icon">
                        <i class="fa-solid fa-headset"></i>
                    </div>
                    <h5>Still have questions?</h5>
                    <p>Our support team is here to help you with delivery, invoice, wallet and product-related questions.</p>
                    <a class="support-btn" href="#"><i class="fa-regular fa-life-ring me-2"></i>Contact Support</a>
                    <a class="wa-btn" href="https://api.whatsapp.com/send?phone=919728622667&text=Hi%2C%20I%20need%20help%20with%20PC%20Deals%20India." target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp me-2"></i>Chat on WhatsApp</a>
                </div>

                <div class="faq-panel">
                    <div class="faq-panel-head">
                        <h4>Frequently Asked <span>Questions</span></h4>
                        <div class="faq-search">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <input type="search" id="faqSearchInput" placeholder="Search your question...">
                        </div>
                    </div>

                    <div class="accordion faq-accordion" id="homeFaqAccordion">
                        @php
                            $faqs = [
                                ['q' => 'How to purchase on www.pcdealsindia.com?', 'a' => 'Register yourself first and then select the company, click the product, select quantity, click buy now, click pay now, pay from different options displayed on the screen. After a successful payment, please check your WhatsApp or Email for the product key.'],
                                ['q' => 'How would I get my invoice/bill?', 'a' => 'Your GST invoice is uploaded in your account under "My Orders" tab on our website and app within 24 hours of your purchase. You can download it from there any time after that.'],
                                ['q' => 'How will I get my key?', 'a' => 'After the payment you will receive your key on your WhatsApp and Email within 1 second automatically. You don\'t need to call us for the key. You can see your key on our portal also under "my orders".'],
                                ['q' => 'Will I get any box/cd/dvd for the product I have purchased?', 'a' => 'No. You will receive the key only.'],
                                ['q' => 'How much time it will take to get the key?', 'a' => 'After the successful payment, you will receive your key within 1 second on your WhatsApp and Email. You can see your key on our portal under "my orders" also.'],
                                ['q' => 'Is GST included in the prices? Can we claim GST input credit on your invoice?', 'a' => 'Yes. And anyone can claim GST input credit on our invoice. All the relevant information is uploaded on the GST portal by us precisely in time.'],
                            ];
                        @endphp

                        @foreach($faqs as $i => $faq)
                            <div class="accordion-item faq-item" data-faq-text="{{ strtolower($faq['q']) }}">
                                <h2 class="accordion-header" id="faqHeading{{ $i }}">
                                    <button class="accordion-button {{ $i > 0 ? 'collapsed' : '' }}" type="button" data-bs-toggle="collapse" data-bs-target="#faqCollapse{{ $i }}" aria-expanded="{{ $i === 0 ? 'true' : 'false' }}" aria-controls="faqCollapse{{ $i }}">
                                        Q. {{ $faq['q'] }}
                                    </button>
                                </h2>
                                <div id="faqCollapse{{ $i }}" class="accordion-collapse collapse {{ $i === 0 ? 'show' : '' }}" aria-labelledby="faqHeading{{ $i }}" data-bs-parent="#homeFaqAccordion">
                                    <div class="accordion-body">
                                        A. {{ $faq['a'] }}
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
@endsection

@push('scripts')
<script>
    (function() {
        var track = document.getElementById('reviewsTrack');
        var prevBtn = document.getElementById('reviewPrevBtn');
        var nextBtn = document.getElementById('reviewNextBtn');
        var dotsContainer = document.getElementById('reviewsDots');
        if (!track) return;

        var cards = track.querySelectorAll('.review-card');
        var cardWidth = 296;
        var gap = 16;
        var step = cardWidth + gap;
        var maxScroll = Math.max(0, cards.length * step - track.parentElement.offsetWidth);
        var current = 0;
        var numDots = Math.ceil(cards.length / 2);

        function renderDots() {
            dotsContainer.innerHTML = '';
            for (var i = 0; i < numDots; i++) {
                var btn = document.createElement('button');
                btn.addEventListener('click', function() { goTo(this.dataset.index); });
                btn.dataset.index = i;
                if (i === 0) btn.classList.add('active');
                dotsContainer.appendChild(btn);
            }
        }

        function goTo(index) {
            current = Math.min(index, numDots - 1);
            var scroll = Math.min(current * step * 2, maxScroll);
            track.style.transform = 'translateX(-' + scroll + 'px)';
            var dots = dotsContainer.querySelectorAll('button');
            dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
        }

        prevBtn.addEventListener('click', function() { goTo(current - 1); });
        nextBtn.addEventListener('click', function() { goTo(current + 1); });
        renderDots();

        document.getElementById('faqSearchInput')?.addEventListener('input', function() {
            var q = this.value.toLowerCase().trim();
            document.querySelectorAll('.faq-item').forEach(function(item) {
                var text = item.dataset.faqText || '';
                item.style.display = q === '' || text.includes(q) ? '' : 'none';
            });
        });
    })();
</script>
@endpush
