@extends('layouts.admin')

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
            <div class="card text-bg-danger">
                <div class="card-body">
                    <h5 class="card-title">Pending Orders</h5>
                    <p class="card-text display-6">{{ $pendingOrdersCount }}</p>
                    <p class="mb-2">Orders awaiting review or payment confirmation.</p>
                    <a href="{{ route('admin.orders.index') }}" class="text-white">View orders &rarr;</a>
                </div>
            </div>
        </div>
        <div class="col-md-4 mb-3">
            <div class="card text-bg-warning">
                <div class="card-body">
                    <h5 class="card-title">License Inventory Alerts</h5>
                    <p class="card-text display-6">{{ $lowStockBatchCount }}</p>
                    <p class="mb-2">Batches low on available keys (under 10).</p>
                    <a href="{{ route('admin.license-keys.index') }}" class="text-dark">Manage keys &rarr;</a>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-3">
        <div class="col-md-6 mb-3">
            <div class="card text-bg-success">
                <div class="card-body">
                    <h5 class="card-title">Total Orders</h5>
                    <p class="card-text display-6">{{ \App\Models\Order::count() }}</p>
                    <a href="{{ route('admin.orders.index') }}" class="text-white">Order management &rarr;</a>
                </div>
            </div>
        </div>
        <div class="col-md-6 mb-3">
            <div class="card text-bg-info">
                <div class="card-body">
                    <h5 class="card-title">Available License Keys</h5>
                    <p class="card-text display-6">{{ $availableLicenseKeyCount }}</p>
                    <a href="{{ route('admin.license-keys.index') }}" class="text-white">Export keys &rarr;</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
