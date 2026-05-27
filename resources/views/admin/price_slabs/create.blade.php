@extends('layouts.admin')

@section('title', 'Add Price Slab - ' . $product->name)

@section('content')
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <h2 class="mb-4">Add Price Slab for {{ $product->name }}</h2>

            @if($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('admin.price-slabs.store', $product) }}">
                @csrf

                <div class="mb-3">
                    <label class="form-label">Quantity (min units) <span class="text-danger">*</span></label>
                    <input type="number" name="qty" class="form-control" value="{{ old('qty') }}" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Unit Price (₹) <span class="text-danger">*</span></label>
                    <input type="number" step="0.01" name="unit_price" class="form-control" value="{{ old('unit_price') }}" required>
                </div>

                <div class="mb-3">
                    <label class="form-label">Label</label>
                    <input type="text" name="label" class="form-control" value="{{ old('label') }}" placeholder="e.g., Buy 5 - ₹300 each">
                </div>

                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="is_popular" value="1" id="isPopular" {{ old('is_popular') ? 'checked' : '' }}>
                        <label class="form-check-label" for="isPopular">Mark as Popular</label>
                    </div>
                </div>

                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="is_hot" value="1" id="isHot" {{ old('is_hot') ? 'checked' : '' }}>
                        <label class="form-check-label" for="isHot">Mark as Hot Deal</label>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">Add Price Slab</button>
                <a href="{{ route('admin.price-slabs.index', $product) }}" class="btn btn-secondary">Cancel</a>
            </form>
        </div>
    </div>
</div>
@endsection
