@extends('layouts.app')

@section('title', 'Admin Dashboard - PCQLand')

@section('content')
<div class="container">
    <h1>Admin Dashboard</h1>

    <div class="row mt-4">
        <div class="col-md-4 mb-3">
            <div class="card text-bg-primary">
                <div class="card-body">
                    <h5 class="card-title">Products</h5>
                    <p class="card-text display-6">{{ \App\Models\Product::count() }}</p>
                    <a href="{{ route('admin.products.index') }}" class="text-white">Manage &rarr;</a>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card text-bg-success">
                <div class="card-body">
                    <h5 class="card-title">Orders</h5>
                    <p class="card-text display-6">{{ \App\Models\Order::count() }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card text-bg-info">
                <div class="card-body">
                    <h5 class="card-title">License Batches</h5>
                    <p class="card-text display-6">{{ \App\Models\LicenseKeyBatch::count() }}</p>
                    <a href="{{ route('admin.license-keys.index') }}" class="text-white">Manage &rarr;</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
