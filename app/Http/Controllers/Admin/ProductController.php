<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\LicenseKeys\AuditService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->paginate(20);

        return view('admin.products.index', compact('products'));
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->get();

        return view('admin.products.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug',
            'category_id' => 'required|integer|exists:categories,id',
            'base_price' => 'required|numeric|min:0',
            'short_description' => 'nullable|string|max:500',
            'description_html' => 'nullable|string',
            'min_qty' => 'nullable|integer|min:1',
            'max_qty' => 'nullable|integer|min:1',
            'cashback_per_unit' => 'nullable|numeric|min:0',
        ]);

        $product = Product::create($request->only([
            'category_id', 'name', 'slug', 'short_description', 'description_html',
            'base_price', 'min_qty', 'max_qty', 'cashback_per_unit',
        ]));

        AuditService::log('create', 'Product', $product->id, ['product' => $product->toArray()]);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('is_active', true)->get();

        return view('admin.products.edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $product->id,
            'category_id' => 'required|integer|exists:categories,id',
            'base_price' => 'required|numeric|min:0',
            'short_description' => 'nullable|string|max:500',
            'description_html' => 'nullable|string',
            'min_qty' => 'nullable|integer|min:1',
            'max_qty' => 'nullable|integer|min:1',
            'cashback_per_unit' => 'nullable|numeric|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $before = $product->toArray();
        $product->update($request->only([
            'category_id', 'name', 'slug', 'short_description', 'description_html',
            'base_price', 'min_qty', 'max_qty', 'cashback_per_unit', 'is_active',
        ]));

        AuditService::log('update', 'Product', $product->id, ['before' => $before, 'after' => $product->toArray()]);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        AuditService::log('delete', 'Product', $product->id, ['product' => $product->toArray()]);
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
