<?php

namespace App\Providers;

use App\Models\Category;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
    }

    public function boot(): void
    {
        View::share('categories', Category::whereNull('parent_id')->where('is_active', true)->with('children')->orderBy('sort_order')->get());
    }
}
