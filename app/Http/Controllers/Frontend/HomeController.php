<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;

class HomeController extends Controller
{
    public function index()
    {
        $featuredProducts = Product::where('is_active', true)->latest()->take(6)->get();
        $reviews = Review::where('is_approved', true)->latest()->take(12)->get();

        return view('frontend.home', compact('featuredProducts', 'reviews'));
    }
}
