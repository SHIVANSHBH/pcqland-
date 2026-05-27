<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())->orderByDesc('created_at')->paginate(10);

        return view('frontend.account.orders', compact('orders'));
    }

    public function show(string $orderNo)
    {
        $order = Order::where('order_no', $orderNo)
            ->where('user_id', Auth::id())
            ->with('items')
            ->firstOrFail();

        return view('frontend.account.order_show', compact('order'));
    }
}
