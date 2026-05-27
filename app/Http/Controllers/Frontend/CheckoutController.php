<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Cart\CartService;
use App\Services\Orders\OrderService;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function index(CartService $cartService)
    {
        return view('frontend.checkout.index', [
            'cartItems' => $cartService->getItems(),
            'cartTotal' => $cartService->getSubtotal(),
        ]);
    }

    public function createOrder(Request $request, OrderService $orderService)
    {
        $request->validate([
            'billing_name' => 'required|string|max:255',
            'billing_email' => 'required|email',
            'billing_phone' => 'required|string|max:20',
        ]);

        $billing = [
            'name' => $request->input('billing_name'),
            'email' => $request->input('billing_email'),
            'phone' => $request->input('billing_phone'),
            'address' => $request->input('billing_address'),
            'city' => $request->input('billing_city'),
            'state' => $request->input('billing_state'),
            'pincode' => $request->input('billing_pincode'),
        ];

        $order = $orderService->createPendingOrder($billing, auth()->id());

        return redirect()->route('payment.initiate', ['order_id' => $order->id]);
    }

    public function success()
    {
        return view('frontend.checkout.success');
    }
}
