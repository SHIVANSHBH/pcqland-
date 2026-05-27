<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductPriceSlab;
use Illuminate\Http\Request;

class PriceSlabController extends Controller
{
    public function index(Product $product)
    {
        $slabs = $product->priceSlabs()->orderBy('qty')->paginate(20);

        return view('admin.price_slabs.index', compact('product', 'slabs'));
    }

    public function create(Product $product)
    {
        return view('admin.price_slabs.create', compact('product'));
    }

    public function store(Request $request, Product $product)
    {
        $request->validate([
            'qty' => 'required|integer|min:1|unique:product_price_slabs,qty,NULL,id,product_id,' . $product->id,
            'unit_price' => 'required|numeric|min:0',
            'label' => 'nullable|string|max:255',
            'is_popular' => 'nullable|boolean',
            'is_hot' => 'nullable|boolean',
        ]);

        $product->priceSlabs()->create($request->only(['qty', 'unit_price', 'label', 'is_popular', 'is_hot']));

        return redirect()->route('admin.price-slabs.index', $product)->with('success', 'Price slab added.');
    }

    public function edit(Product $product, ProductPriceSlab $slab)
    {
        return view('admin.price_slabs.edit', compact('product', 'slab'));
    }

    public function update(Request $request, Product $product, ProductPriceSlab $slab)
    {
        $request->validate([
            'qty' => 'required|integer|min:1|unique:product_price_slabs,qty,' . $slab->id . ',id,product_id,' . $product->id,
            'unit_price' => 'required|numeric|min:0',
            'label' => 'nullable|string|max:255',
            'is_popular' => 'nullable|boolean',
            'is_hot' => 'nullable|boolean',
        ]);

        $slab->update($request->only(['qty', 'unit_price', 'label', 'is_popular', 'is_hot']));

        return redirect()->route('admin.price-slabs.index', $product)->with('success', 'Price slab updated.');
    }

    public function destroy(Product $product, ProductPriceSlab $slab)
    {
        $slab->delete();

        return redirect()->route('admin.price-slabs.index', $product)->with('success', 'Price slab deleted.');
    }
}
