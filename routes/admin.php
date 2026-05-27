<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LicenseKeyController;
use App\Http\Controllers\Admin\PriceSlabController;
use App\Http\Controllers\Admin\ProductController;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/products/{product}/price-slabs', [PriceSlabController::class, 'index'])->name('price-slabs.index');
    Route::get('/products/{product}/price-slabs/create', [PriceSlabController::class, 'create'])->name('price-slabs.create');
    Route::post('/products/{product}/price-slabs', [PriceSlabController::class, 'store'])->name('price-slabs.store');
    Route::get('/products/{product}/price-slabs/{slab}/edit', [PriceSlabController::class, 'edit'])->name('price-slabs.edit');
    Route::put('/products/{product}/price-slabs/{slab}', [PriceSlabController::class, 'update'])->name('price-slabs.update');
    Route::delete('/products/{product}/price-slabs/{slab}', [PriceSlabController::class, 'destroy'])->name('price-slabs.destroy');

    Route::get('/license-keys', [LicenseKeyController::class, 'index'])->name('license-keys.index');
    Route::post('/license-keys/import', [LicenseKeyController::class, 'import'])->name('license-keys.import');
    Route::get('/license-keys/batch/{batch}/export', [LicenseKeyController::class, 'export'])->name('license-keys.export');
    Route::get('/license-keys/audit-log', [LicenseKeyController::class, 'auditLog'])->name('license-keys.audit-log');
});
