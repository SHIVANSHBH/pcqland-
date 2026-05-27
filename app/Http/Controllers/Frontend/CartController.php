<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Cart\CartService;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(CartService $cartService)
    {
        return view('frontend.cart.index', [
            'cartItems' => $cartService->getItems(),
            'cartTotal' => $cartService->getSubtotal(),
        ]);
    }

    public function add(Request $request, CartService $cartService)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'qty' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->input('product_id'));
        $cartService->add($product, (int) $request->input('qty'));

        return redirect()->route('cart.index')->with('success', 'Product added to cart.');
    }

    public function update(Request $request, CartService $cartService)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'qty' => 'required|integer|min:0',
        ]);

        $cartService->updateQuantity((int) $request->input('product_id'), (int) $request->input('qty'));

        return redirect()->route('cart.index')->with('success', 'Cart updated.');
    }

    public function remove(Request $request, CartService $cartService)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ]);

        $cartService->remove((int) $request->input('product_id'));

        return redirect()->route('cart.index')->with('success', 'Item removed from cart.');
    }

    public function clear(CartService $cartService)
    {
        $cartService->clear();

        return redirect()->route('cart.index')->with('success', 'Cart cleared.');
    }
}
