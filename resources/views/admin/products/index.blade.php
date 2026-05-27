@extends('layouts.admin')

@section('title', 'Admin Products - PCQLand')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Products</h1>
        <a href="{{ route('admin.products.create') }}" class="btn btn-primary">Add Product</a>
    </div>

    <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Slug</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($products as $product)
                    <tr>
                        <td>{{ $product->name }}</td>
                        <td>{{ optional($product->category)->name ?? '—' }}</td>
                        <td>{{ $product->slug }}</td>
                        <td>₹{{ number_format($product->base_price, 2) }}</td>
                        <td>{{ $product->is_active ? 'Active' : 'Inactive' }}</td>
                        <td class="text-nowrap">
                            <a href="{{ route('admin.products.edit', $product) }}" class="btn btn-sm btn-outline-primary me-1">Edit</a>
                            <a href="{{ route('admin.price-slabs.index', $product) }}" class="btn btn-sm btn-outline-info me-1">Slabs</a>
                            <form method="POST" action="{{ route('admin.products.destroy', $product) }}" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this product?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    {{ $products->links() }}
</div>
@endsection
