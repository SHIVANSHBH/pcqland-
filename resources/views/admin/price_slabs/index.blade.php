@extends('layouts.admin')

@section('title', 'Price Slabs - ' . $product->name)

@section('content')
<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Price Slabs for {{ $product->name }}</h2>
                <a href="{{ route('admin.price-slabs.create', $product) }}" class="btn btn-primary">Add Price Slab</a>
            </div>

            @if(session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif

            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Label</th>
                        <th>Popular</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($slabs as $slab)
                        <tr>
                            <td>{{ $slab->qty }} units</td>
                            <td>₹{{ number_format($slab->unit_price, 2) }}</td>
                            <td>{{ $slab->label }}</td>
                            <td>{{ $slab->is_popular ? '✓' : '—' }}</td>
                            <td>
                                <a href="{{ route('admin.price-slabs.edit', [$product, $slab]) }}" class="btn btn-sm btn-outline-primary">Edit</a>
                                <form method="POST" action="{{ route('admin.price-slabs.destroy', [$product, $slab]) }}" style="display: inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            {{ $slabs->links() }}

            <a href="{{ route('admin.products.index') }}" class="btn btn-secondary mt-3">Back to Products</a>
        </div>
    </div>
</div>
@endsection
