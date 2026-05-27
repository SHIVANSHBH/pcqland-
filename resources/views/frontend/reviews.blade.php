@extends('layouts.app')

@section('title', 'Website Reviews - PCQLand')

@section('content')
<div class="page-shell py-4 py-md-5">
    <div class="row justify-content-center">
        <div class="col-lg-10">
            <div class="card border-0 shadow-sm" style="border-radius:18px;overflow:hidden;">
                <div class="card-body p-0">
                    <div style="background:linear-gradient(135deg,#0f4c81 0%,#1b78c2 100%);color:#fff;padding:28px;">
                        <h2 class="mb-2" style="font-weight:800;">Share Your Experience</h2>
                        <p class="mb-0" style="opacity:0.92;">Your feedback helps other customers and improves our service quality.</p>
                    </div>
                    <div class="p-4 p-md-5" style="background:linear-gradient(180deg,#fff 0%,#f6f9ff 100%);">
                        @if(session('success'))
                            <div class="alert alert-success">{{ session('success') }}</div>
                        @endif
                        <form method="POST" action="{{ route('reviews.submit') }}">
                            @csrf
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="name" class="form-label fw-semibold">Full Name</label>
                                    <input type="text" class="form-control" id="name" name="name" value="{{ old('name') }}" maxlength="80" required style="border-radius:10px;padding:10px 14px;">
                                </div>
                                <div class="col-md-6">
                                    <label for="city" class="form-label fw-semibold">City</label>
                                    <input type="text" class="form-control" id="city" name="city" value="{{ old('city') }}" maxlength="60" required style="border-radius:10px;padding:10px 14px;">
                                </div>
                                <div class="col-md-6">
                                    <label for="state" class="form-label fw-semibold">State</label>
                                    <input type="text" class="form-control" id="state" name="state" value="{{ old('state') }}" maxlength="60" required style="border-radius:10px;padding:10px 14px;">
                                </div>
                                <div class="col-12">
                                    <label for="description" class="form-label fw-semibold">Your Review</label>
                                    <textarea class="form-control" id="description" name="description" rows="5" maxlength="1000" required style="border-radius:10px;padding:10px 14px;">{{ old('description') }}</textarea>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap gap-2 mt-4">
                                <button type="submit" class="btn px-4" style="background:linear-gradient(135deg,#0f4c81 0%,#1b78c2 100%);border:none;color:#fff;border-radius:8px;font-weight:700;padding:12px 24px;">Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            @if($reviews->count() > 0)
                <div class="mt-5">
                    <h3 class="mb-4" style="font-weight:800;font-size:20px;color:var(--pcd-dark);">
                        <i class="fa-regular fa-star me-2" style="color:var(--pcd-green);"></i>
                        Customer Reviews ({{ $reviews->count() }})
                    </h3>
                    <div class="row g-4">
                        @foreach($reviews as $review)
                            <div class="col-md-6">
                                <div style="background:#fff;border:1px solid var(--pcd-border);border-radius:14px;padding:20px;height:100%;">
                                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                                        <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--pcd-green),#6f9814);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex:0 0 40px;">
                                            {{ substr($review->name, 0, 1) }}
                                        </div>
                                        <div>
                                            <h6 style="margin:0;font-weight:700;font-size:14px;color:var(--pcd-dark);">{{ $review->name }}</h6>
                                            <p style="margin:2px 0 0;font-size:12px;color:var(--pcd-muted);">{{ $review->city }}, {{ $review->state }}</p>
                                        </div>
                                    </div>
                                    <p style="font-size:14px;color:var(--pcd-text);line-height:1.6;margin:0;font-style:italic;">"{{ $review->description }}"</p>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
