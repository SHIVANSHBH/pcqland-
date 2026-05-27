<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductPricingController;

Route::get('/product/{id}/dynamic-pricing', [ProductPricingController::class, 'calculate']);
