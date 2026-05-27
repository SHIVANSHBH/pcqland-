<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class StaticPageController extends Controller
{
    public function reviews()
    {
        $reviews = Review::where('is_approved', true)->latest()->get();

        return view('frontend.reviews', compact('reviews'));
    }

    public function submitReview(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:80',
            'city' => 'required|string|max:60',
            'state' => 'required|string|max:60',
            'description' => 'required|string|max:1000',
        ]);

        Review::create($data);

        return redirect()->route('reviews')->with('success', 'Thank you for your review! It will be displayed after approval.');
    }

    public function contact()
    {
        return view('frontend.contact');
    }

    public function cid()
    {
        return redirect()->route('login');
    }

    public function page(Request $request)
    {
        $name = $request->query('name');
        $view = match ($name) {
            'ABOUT-US' => 'frontend.pages.about',
            'Privacy-Policy-New' => 'frontend.pages.privacy',
            'SHIPPING-RETURN' => 'frontend.pages.shipping',
            'TC-And-Disclaimer' => 'frontend.pages.terms',
            default => null,
        };

        if ($view && view()->exists($view)) {
            $titles = [
                'ABOUT-US' => 'About Us',
                'Privacy-Policy-New' => 'Privacy Policy',
                'SHIPPING-RETURN' => 'Shipping & Return',
                'TC-And-Disclaimer' => 'T&C and Disclaimer',
            ];
            return view($view)->with('pageTitle', $titles[$name] ?? $name);
        }

        abort(404);
    }
}
