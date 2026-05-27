<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\CheckoutController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\OrderController;
use App\Http\Controllers\Frontend\ProductController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/shop', [ProductController::class, 'index'])->name('shop.index');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('shop.product');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');
Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'createOrder'])->name('checkout.create');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');

Route::match(['get', 'post'], '/payment/initiate/{order_id}', [\App\Http\Controllers\Frontend\PaymentController::class, 'initiatePayment'])->name('payment.initiate');
Route::post('/payment/verify', [\App\Http\Controllers\Frontend\PaymentController::class, 'verifyPayment'])->name('payment.verify');
Route::post('/payment/webhook', [\App\Http\Controllers\Frontend\PaymentController::class, 'webhook'])->name('payment.webhook');

Route::get('/reviews', [\App\Http\Controllers\Frontend\StaticPageController::class, 'reviews'])->name('reviews');
Route::post('/reviews', [\App\Http\Controllers\Frontend\StaticPageController::class, 'submitReview'])->name('reviews.submit');
Route::get('/contact', [\App\Http\Controllers\Frontend\StaticPageController::class, 'contact'])->name('contact');
Route::get('/get-cid', [\App\Http\Controllers\Frontend\StaticPageController::class, 'cid'])->name('cid');
Route::get('/page', [\App\Http\Controllers\Frontend\StaticPageController::class, 'page'])->name('page');

Route::middleware('auth')->prefix('account')->name('account.')->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order_no}', [OrderController::class, 'show'])->name('orders.show');
});

require __DIR__ . '/admin.php';
