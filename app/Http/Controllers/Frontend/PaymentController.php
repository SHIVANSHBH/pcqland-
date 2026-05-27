<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Orders\OrderService;
use App\Services\Payment\RazorpayService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
    }

    public function initiatePayment(Request $request, RazorpayService $razorpayService, $order_id = null)
    {
        $id = $order_id ?? $request->input('order_id');
        $order = Order::where('id', $id)
            ->where('payment_status', 'pending_payment')
            ->firstOrFail();

        $razorpayKey = env('RAZORPAY_KEY_ID');

        if (empty($razorpayKey)) {
            $this->orderService->completePayment($order);
            return redirect()->route('checkout.success');
        }

        try {
            $razorpayOrder = $razorpayService->createOrder($order);

            return view('frontend.payment.razorpay', [
                'order' => $order,
                'razorpayOrder' => $razorpayOrder,
                'razorpayKey' => $razorpayKey,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['payment' => 'Could not initiate payment. ' . $e->getMessage()]);
        }
    }

    public function verifyPayment(Request $request, RazorpayService $razorpayService)
    {
        $request->validate([
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        try {
            if (!$razorpayService->verifyPayment($request->all())) {
                return back()->withErrors(['payment' => 'Payment verification failed.']);
            }

            $order = Order::where('gateway_order_id', $request->input('razorpay_order_id'))->firstOrFail();
            $order->update([
                'gateway_payment_id' => $request->input('razorpay_payment_id'),
            ]);

            $this->orderService->completePayment($order);

            return redirect()->route('checkout.success');
        } catch (\Exception $e) {
            return back()->withErrors(['payment' => 'Payment verification error: ' . $e->getMessage()]);
        }
    }

    public function webhook(Request $request)
    {
        $payload = $request->all();

        if ($payload['event'] === 'payment.authorized' || $payload['event'] === 'payment.captured') {
            $order = Order::where('gateway_payment_id', $payload['payload']['payment']['entity']['id'])
                ->first();

            if ($order) {
                $order->update(['payment_status' => 'paid']);
                $this->orderService->completePayment($order);
            }
        }

        return response()->json(['status' => 'success']);
    }
}
