@extends('layouts.app')

@section('title', 'Register - PCQLand')

@push('styles')
<style>
    .login-container { padding: 24px 0 32px; }
    .signup-trust-wrap { margin-top: 12px; }
    .signup-bottom-trust {
        background: #fff; border: 1px solid var(--pcd-border); border-radius: 12px;
        display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); overflow: hidden;
    }
    .signup-bottom-trust .trust-item {
        padding: 12px 10px; display: flex; align-items: center; gap: 10px; border-right: 1px solid #ecf1f6;
    }
    .signup-bottom-trust .trust-item:last-child { border-right: 0; }
    .signup-bottom-trust .trust-icon {
        width: 34px; height: 34px; border-radius: 999px; display: inline-flex; align-items: center;
        justify-content: center; font-size: 14px; flex: 0 0 auto;
    }
    .signup-bottom-trust .trust-icon.secure { background: #e8efff; color: #3c5ddf; }
    .signup-bottom-trust .trust-icon.instant { background: #fff1cc; color: #cc8a00; }
    .signup-bottom-trust .trust-icon.support { background: #e8efff; color: #4964d8; }
    .signup-bottom-trust .trust-icon.chat { background: #e8f9ef; color: #1fae5b; }
    .signup-bottom-trust h6 { margin: 0; font-size: 13px; font-weight: 700; color: var(--pcd-text); }
    .signup-bottom-trust p { margin: 2px 0 0; font-size: 11px; color: #6b7280; }
    @media (max-width: 768px) {
        .login-container { padding: 14px 0 16px; }
        .signup-bottom-trust { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 420px) {
        .signup-bottom-trust { grid-template-columns: 1fr; }
    }
</style>
@endpush

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    var pincodeInput = document.getElementById('entry_postcode');
    if (!pincodeInput) return;
    pincodeInput.addEventListener('blur', function () {
        var pincode = this.value.trim();
        if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) return;
        fetch('https://api.postalpincode.in/pincode/' + pincode)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
                    var po = data[0].PostOffice[0];
                    var cityInput = document.querySelector('[name="city"]');
                    var stateInput = document.querySelector('[name="state"]');
                    if (cityInput && !cityInput.value) cityInput.value = po.District || po.Name || '';
                    if (stateInput && !stateInput.value) stateInput.value = po.State || '';
                }
            })
            .catch(function () {});
    });
});
</script>
@endpush

@section('content')
<div class="login-container">
    <div class="container">
        <div class="login-top-cta-wrap">
            <div class="new-account-cta">
                <div class="hint">Already have an account?</div>
                <a href="{{ route('login') }}" class="signup-now-btn">
                    <i class="fa-solid fa-right-to-bracket"></i> Login Now
                </a>
            </div>
        </div>

        <div class="login-shell">
            <div class="login-benefits">
                <h2 class="benefits-headline">Join <br><span class="highlight">PCQLand 🚀</span></h2>
                <p class="benefits-subheading">Create your account and start your business journey</p>

                <ul class="benefits-list">
                    <li>
                        <div class="icon delivery"><i class="fas fa-lock-open"></i></div>
                        <div class="text">
                            <h6>Secure Account</h6>
                            <p>Your data is fully encrypted & protected</p>
                        </div>
                    </li>
                    <li>
                        <div class="icon price"><i class="fas fa-percent"></i></div>
                        <div class="text">
                            <h6>Best Prices</h6>
                            <p>Exclusive dealer pricing on all products</p>
                        </div>
                    </li>
                    <li>
                        <div class="icon invoice"><i class="fas fa-bolt"></i></div>
                        <div class="text">
                            <h6>Instant Delivery</h6>
                            <p>Keys delivered in 1 second via email/WhatsApp</p>
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
            </div>

            <div class="login-form-section">
                <div class="form-header">
                    <h1 class="form-title">Create Your Account</h1>
                    <p class="form-subtitle">Join and grow your business</p>
                </div>

                @if($errors->any())
                    <div class="alert alert-danger py-2" style="font-size:12px;">
                        @foreach($errors->all() as $err)
                            <div>{{ $err }}</div>
                        @endforeach
                    </div>
                @endif

                <form method="POST" action="{{ route('register.submit') }}">
                    @csrf
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="name">Full Name <span class="required">*</span></label>
                            <input type="text" name="name" id="name" class="form-control" placeholder="Enter your full name" required value="{{ old('name') }}" style="border-radius:8px;padding:10px 12px;">
                        </div>
                        <div class="form-group">
                            <label for="customers_telephone">Mobile No. <span class="required">*</span></label>
                            <input type="text" name="customers_telephone" id="customers_telephone" class="form-control" placeholder="Enter your mobile number" pattern="\d{10}" maxlength="10" required value="{{ old('customers_telephone') }}" style="border-radius:8px;padding:10px 12px;">
                        </div>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="email">Email Id <span class="required">*</span></label>
                            <input type="email" name="email" id="email" class="form-control" placeholder="Enter your email address" required value="{{ old('email') }}" style="border-radius:8px;padding:10px 12px;">
                        </div>
                        <div class="form-group">
                            <label for="entry_postcode">Pin Code <span class="required">*</span></label>
                            <input type="text" name="entry_postcode" id="entry_postcode" class="form-control" placeholder="Enter your pincode" required value="{{ old('entry_postcode') }}" style="border-radius:8px;padding:10px 12px;">
                        </div>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="password">Create Password <span class="required">*</span></label>
                            <input type="password" name="password" id="password" class="form-control" placeholder="Create a strong password" required style="border-radius:8px;padding:10px 12px;">
                        </div>
                        <div class="form-group">
                            <label for="password_confirmation">Confirm Password <span class="required">*</span></label>
                            <input type="password" name="password_confirmation" id="password_confirmation" class="form-control" placeholder="Confirm your password" required style="border-radius:8px;padding:10px 12px;">
                        </div>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="city">City <span class="optional">(auto-filled)</span></label>
                            <input type="text" name="city" id="city" class="form-control" placeholder="Auto-filled from pincode" value="{{ old('city') }}" style="border-radius:8px;padding:10px 12px;">
                        </div>
                        <div class="form-group">
                            <label for="state">State <span class="optional">(auto-filled)</span></label>
                            <input type="text" name="state" id="state" class="form-control" placeholder="Auto-filled from pincode" value="{{ old('state') }}" style="border-radius:8px;padding:10px 12px;">
                        </div>
                    </div>

                    <div class="form-grid full">
                        <div class="form-group">
                            <label for="entry_street_address">Address <span class="required">*</span></label>
                            <textarea name="entry_street_address" id="entry_street_address" class="form-control" placeholder="Enter your full address" rows="3" style="border-radius:8px;padding:10px 12px;resize:vertical;">{{ old('entry_street_address') }}</textarea>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-form-primary">Create Account</button>
                    </div>

                    <div class="security-message">
                        <i class="fas fa-lock"></i> Your information is 100% secure and will never be shared
                    </div>
                </form>

                <div class="signup-trust-wrap">
                    <div class="signup-bottom-trust">
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
                                <p>Always here to help</p>
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
