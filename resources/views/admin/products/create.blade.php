@extends('layouts.admin')

@section('title', 'Add Product - Admin')

@section('content')
<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <h2 class="mb-4">Add New Product</h2>

            @if($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('admin.products.store') }}">
                @csrf

                <div class="card">
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label">Product Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" class="form-control" value="{{ old('name') }}" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Slug <span class="text-danger">*</span></label>
                            <input type="text" name="slug" class="form-control" value="{{ old('slug') }}" required>
                            <small class="text-muted">URL-friendly name (e.g., windows-10-pro)</small>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Category <span class="text-danger">*</span></label>
                            <select name="category_id" class="form-control" required>
                                <option value="">Select Category</option>
                                @foreach($categories as $cat)
                                    <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Base Price (₹) <span class="text-danger">*</span></label>
                                <input type="number" step="0.01" name="base_price" class="form-control" value="{{ old('base_price') }}" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Cashback Per Unit (₹)</label>
                                <input type="number" step="0.01" name="cashback_per_unit" class="form-control" value="{{ old('cashback_per_unit', 0) }}">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Min Quantity</label>
                                <input type="number" name="min_qty" class="form-control" value="{{ old('min_qty', 1) }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Max Quantity</label>
                                <input type="number" name="max_qty" class="form-control" value="{{ old('max_qty', 50) }}">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Short Description</label>
                            <textarea name="short_description" class="form-control" rows="2">{{ old('short_description') }}</textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Description (HTML)</label>
                            <textarea name="description_html" class="form-control" rows="4">{{ old('description_html') }}</textarea>
                        </div>
                    </div>
                </div>

                <div class="mt-3">
                    <button type="submit" class="btn btn-primary">Create Product</button>
                    <a href="{{ route('admin.products.index') }}" class="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
