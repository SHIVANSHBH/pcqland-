@extends('layouts.app')

@section('title', 'Login - PCQLand')

@push('styles')
<style>
    .login-container { padding: 24px 0 32px; }
    .login-benefits .reviews-section { margin-top: 0; padding: 0; background: transparent; border: 0; border-radius: 0; box-shadow: none; }
    .login-benefits .reviews-head { margin-bottom: 10px; }
    .login-benefits .reviews-head h3 { font-size: 20px; }
    .login-benefits .reviews-frame { padding: 0 34px; max-width: 100%; }
    .login-benefits .reviews-track { display: flex; gap: 0 !important; }
    .login-benefits .reviews-viewport { overflow: hidden; }
    .login-benefits .review-card { flex: 0 0 100% !important; max-width: 100% !important; min-height: 170px; box-sizing: border-box; }
    .login-tab-nav { display:flex; gap:4px; margin-bottom:20px; border-radius:10px; background:#f1f5f9; padding:4px; }
    .login-tab-nav button { flex:1; padding:10px 14px; border:0; border-radius:8px; font-size:13px; font-weight:600; background:transparent; color:#64748b; cursor:pointer; transition:all 0.2s; font-family:inherit; }
    .login-tab-nav button.active { background:#fff; color:#1e293b; box-shadow:0 2px 6px rgba(0,0,0,0.08); }
    .login-tab { display:none; }
    .login-tab.active { display:block; }
    .otp-input-group { display: flex; gap: 10px; align-items: flex-start; flex-wrap: wrap; margin-top: 8px; }
    .otp-input-group input { flex: 1; min-width: 150px; padding: 10px 12px; border: 1.5px solid var(--pcd-border); border-radius: 8px; font-size: 13px; font-family: inherit; }
    .otp-input-group input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    .otp-button { white-space: nowrap; padding: 10px 16px; background-color: #3b82f6; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.3s ease; min-width: 110px; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }
    .otp-button:hover { background-color: #0028a8; transform: translateY(-1px); }
    .otp-button:disabled { background-color: #94a3b8; cursor: not-allowed; transform: none; }
    @media (max-width: 768px) {
        .login-container { padding: 14px 0 16px; }
        .login-benefits { order: 2; }
        .login-form-section { order: 1; }
        .login-benefits .reviews-frame { padding: 0 12px; }
        .login-benefits .review-card { flex: 0 0 100% !important; max-width: 100% !important; min-height: auto; padding: 12px; }
        .login-benefits .review-nav { display: none; }
        .login-benefits .review-body { grid-template-columns: 1fr; text-align: center; }
        .login-benefits .review-avatar { margin: 0 auto; }
        .otp-input-group { flex-direction: column; }
        .otp-input-group input { min-width: 100%; width: 100%; }
        .otp-button { width: 100%; min-width: unset; }
    }
</style>
@endpush

@section('content')
<div class="login-container">
    <div class="container">
        <div class="login-top-cta-wrap">
            <div class="new-account-cta">
                <div class="hint">Don't Have an Account?</div>
                <a href="{{ route('register') }}" class="signup-now-btn">
                    <i class="fa-solid fa-user-plus"></i> Sign Up Free
                </a>
            </div>
        </div>

        <div class="login-shell">
            <div class="login-benefits">
                <h2 class="benefits-headline">Access Your <br>Account <span class="highlight">Instantly 🔓</span></h2>
                <p class="benefits-subheading">Manage orders, track deliveries & save time</p>

                <ul class="benefits-list">
                    <li>
                        <div class="icon delivery"><i class="fas fa-lock-open"></i></div>
                        <div class="text">
                            <h6>Secure Login</h6>
                            <p>Your account is fully encrypted & protected</p>
                        </div>
                    </li>
                    <li>
                        <div class="icon price"><i class="fas fa-history"></i></div>
                        <div class="text">
                            <h6>Order History</h6>
                            <p>Track all your orders in one place</p>
                        </div>
                    </li>
                    <li>
                        <div class="icon invoice"><i class="fas fa-wallet"></i></div>
                        <div class="text">
                            <h6>Wallet & Cashback</h6>
                            <p>Manage your balance and save more</p>
                        </div>
                    </li>
                    <li>
                        <div class="icon secure"><i class="fas fa-headset"></i></div>
                        <div class="text">
                            <h6>Technical Support</h6>
                            <p>We're always here to help you</p>
                        </div>
                    </li>
                </ul>

                @include('frontend.partials._login_reviews')
            </div>

            <div class="login-form-section">
                <div class="form-header">
                    <h1 class="form-title">Login to Your Account</h1>
                    <p class="form-subtitle">Sign in & manage your business</p>
                </div>

                @if(session('error'))
                    <div class="alert alert-danger py-2" style="font-size:12px;">{{ session('error') }}</div>
                @endif

                <div class="login-tab-nav">
                    <button class="active" data-tab="password-tab">Password</button>
                    <button data-tab="email-otp-tab">Email OTP</button>
                    <button data-tab="mobile-otp-tab">Mobile OTP</button>
                </div>

                <div class="login-tab active" id="password-tab">
                    <form method="POST" action="{{ route('login.submit') }}">
                        @csrf
                        <div class="form-grid full">
                            <div class="form-group">
                                <label for="email">Email Address <span class="required">*</span></label>
                                <input type="email" name="email" id="email" class="form-control" placeholder="Enter your email address" required style="border-radius:8px;padding:10px 12px;">
                            </div>
                        </div>

                        <div class="form-grid full">
                            <div class="form-group">
                                <label for="password">Password <span class="required">*</span></label>
                                <input type="password" name="password" id="password" class="form-control" placeholder="Enter your password" required style="border-radius:8px;padding:10px 12px;">
                            </div>
                        </div>

                        @error('email')
                            <div class="alert alert-danger py-2" style="font-size:12px;">{{ $message }}</div>
                        @enderror

                        <div class="form-actions">
                            <button type="submit" class="btn-form-primary">Login Now</button>
                        </div>
                    </form>
                </div>

                <div class="login-tab" id="email-otp-tab">
                    <div class="form-grid full">
                        <div class="form-group">
                            <label for="email_otp">Email Address</label>
                            <div class="otp-input-group">
                                <input type="email" id="email_otp" placeholder="Enter your email">
                                <button type="button" class="otp-button" onclick="alert('OTP service coming soon. Please use Password login.');">Send OTP</button>
                            </div>
                        </div>
                    </div>
                    <div class="form-grid full" style="margin-top:12px;">
                        <div class="form-group">
                            <label for="email_otp_code">Enter OTP</label>
                            <div class="otp-input-group">
                                <input type="text" id="email_otp_code" placeholder="Enter 6-digit OTP" maxlength="6">
                                <button type="button" class="otp-button" onclick="alert('OTP service coming soon. Please use Password login.');" style="background:var(--pcd-green);">Verify & Login</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="login-tab" id="mobile-otp-tab">
                    <div class="form-grid full">
                        <div class="form-group">
                            <label for="mobile_otp">Mobile Number</label>
                            <div class="otp-input-group">
                                <input type="text" id="mobile_otp" placeholder="Enter your 10-digit mobile" maxlength="10">
                                <button type="button" class="otp-button" onclick="alert('OTP service coming soon. Please use Password login.');">Send OTP</button>
                            </div>
                        </div>
                    </div>
                    <div class="form-grid full" style="margin-top:12px;">
                        <div class="form-group">
                            <label for="mobile_otp_code">Enter OTP</label>
                            <div class="otp-input-group">
                                <input type="text" id="mobile_otp_code" placeholder="Enter 6-digit OTP" maxlength="6">
                                <button type="button" class="otp-button" onclick="alert('OTP service coming soon. Please use Password login.');" style="background:var(--pcd-green);">Verify & Login</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="signup-link">
                    Don't have an account? <a href="{{ route('register') }}">Create Account</a>
                </div>

                <div class="login-trust-wrap">
                    <div class="login-bottom-trust">
                        <div class="trust-item">
                            <div class="trust-icon secure"><i class="fas fa-shield-alt"></i></div>
                            <div>
                                <h6>Secure Payments</h6>
                                <p>100% safe & encrypted</p>
                            </div>
                        </div>
                        <div class="trust-item">
                            <div class="trust-icon instant"><i class="fas fa-bolt"></i></div>
                            <div>
                                <h6>1 Sec Delivery</h6>
                                <p>WhatsApp &amp; Email</p>
                            </div>
                        </div>
                        <div class="trust-item">
                            <div class="trust-icon support"><i class="fas fa-headset"></i></div>
                            <div>
                                <h6>Technical Support</h6>
                                <p>We're always here to help</p>
                            </div>
                        </div>
                        <div class="trust-item">
                            <div class="trust-icon chat"><i class="fab fa-whatsapp"></i></div>
                            <div>
                                <h6>Chat Support</h6>
                                <p>Quick help on WhatsApp</p>
                            </div>
                        </div>
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
    document.querySelectorAll('.login-tab-nav button').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.login-tab-nav button').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            document.querySelectorAll('.login-tab').forEach(function(t) { t.classList.remove('active'); });
            document.getElementById(this.dataset.tab)?.classList.add('active');
        });
    });
})();
</script>
@endpush