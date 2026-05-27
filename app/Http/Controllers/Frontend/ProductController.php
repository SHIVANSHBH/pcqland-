<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('is_active', true);

        if ($request->filled('category')) {
            $slug = $request->category;
            $category = Category::where('slug', $slug)->first();
            if ($category) {
                $childIds = $category->children()->pluck('id');
                $categoryIds = $childIds->push($category->id);
                $query->whereIn('category_id', $categoryIds);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        $sort = $request->sort;
        switch ($sort) {
            case 'price-asc':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price-desc':
                $query->orderBy('base_price', 'desc');
                break;
            case 'name-asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name-desc':
                $query->orderBy('name', 'desc');
                break;
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(20)->withQueryString();

        $selectedCategory = null;
        if ($request->filled('category')) {
            $selectedCategory = Category::where('slug', $request->category)->first();
        }

        return view('frontend.shop.index', [
            'products' => $products,
            'selectedCategory' => $selectedCategory,
        ]);
    }

    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)->where('is_active', true)->with('priceSlabs')->firstOrFail();

        return view('frontend.shop.show', [
            'product' => $product,
        ]);
    }
}
