@extends('layouts.app')

@section('title', 'Edit Product - Admin')

@section('content')
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <h2 class="mb-4">Edit Product</h2>

            @if($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('admin.products.update', $product) }}">
                @csrf
                @method('PUT')

                <div class="card">
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Product Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" class="form-control" value="{{ old('name', $product->name) }}" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Slug <span class="text-danger">*</span></label>
                            <input type="text" name="slug" class="form-control" value="{{ old('slug', $product->slug) }}" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Category <span class="text-danger">*</span></label>
                            <select name="category_id" class="form-control" required>
                                @foreach($categories as $cat)
                                    <option value="{{ $cat->id }}" {{ $product->category_id == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Base Price (₹) <span class="text-danger">*</span></label>
                                <input type="number" step="0.01" name="base_price" class="form-control" value="{{ old('base_price', $product->base_price) }}" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Cashback Per Unit (₹)</label>
                                <input type="number" step="0.01" name="cashback_per_unit" class="form-control" value="{{ old('cashback_per_unit', $product->cashback_per_unit) }}">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Min Quantity</label>
                                <input type="number" name="min_qty" class="form-control" value="{{ old('min_qty', $product->min_qty) }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Max Quantity</label>
                                <input type="number" name="max_qty" class="form-control" value="{{ old('max_qty', $product->max_qty) }}">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="is_active" value="1" {{ $product->is_active ? 'checked' : '' }} id="isActive">
                                <label class="form-check-label" for="isActive">Active</label>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Short Description</label>
                            <textarea name="short_description" class="form-control" rows="2">{{ old('short_description', $product->short_description) }}</textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Description (HTML)</label>
                            <textarea name="description_html" class="form-control" rows="4">{{ old('description_html', $product->description_html) }}</textarea>
                        </div>
                    </div>
                </div>

                <div class="mt-3">
                    <button type="submit" class="btn btn-primary">Update Product</button>
                    <a href="{{ route('admin.products.index') }}" class="btn btn-secondary">Cancel</a>
                    <a href="{{ route('admin.price-slabs.index', $product) }}" class="btn btn-info">Manage Price Slabs</a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
