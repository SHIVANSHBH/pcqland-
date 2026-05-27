@extends('layouts.app')

@section('title', 'License Keys - PCQLand')

@section('content')
<div class="container">
    <h1>License Keys</h1>

    <form method="POST" action="{{ route('admin.license-keys.import') }}" enctype="multipart/form-data">
        @csrf
        <div class="mb-3">
            <label class="form-label">Product</label>
            <select name="product_id" class="form-control" required>
                <option value="">Select a product</option>
                @foreach($products as $product)
                    <option value="{{ $product->id }}">{{ $product->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Upload CSV</label>
            <input type="file" name="file" class="form-control" required>
        </div>
        <button class="btn btn-primary">Import Keys</button>
    </form>

    @if(session('success'))
        <div class="alert alert-success mt-3">{{ session('success') }}</div>
    @endif

    <p class="mt-3">Upload one license key per row in a CSV file.</p>

    <h2 class="mt-5">Batches</h2>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Batch</th>
                <th>Product</th>
                <th>Total</th>
                <th>Available</th>
                <th>Sold</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($batches as $batch)
                <tr>
                    <td>{{ $batch->batch_name }}</td>
                    <td>{{ $batch->product->name }}</td>
                    <td>{{ $batch->total_keys }}</td>
                    <td>{{ $batch->available_count }}</td>
                    <td>{{ $batch->sold_count }}</td>
                    <td>{{ $batch->status }}</td>
                    <td>
                        <a href="{{ route('admin.license-keys.export', $batch) }}" class="btn btn-sm btn-outline-secondary">Export</a>
                    </td>
                </tr>
            @empty
                <tr><td colspan="7" class="text-center">No batches imported yet.</td></tr>
            @endforelse
        </tbody>
    </table>
    {{ $batches->links() }}
</div>
@endsection
