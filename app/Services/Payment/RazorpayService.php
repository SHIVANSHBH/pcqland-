<?php

namespace App\Services\Payment;

use App\Models\Order;
use Razorpay\Api\Api;

class RazorpayService
{
    protected $api;

    public function __construct()
    {
        $this->api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
    }

    public function createOrder(Order $order): array
    {
        $razorpayOrder = $this->api->order->create([
            'amount' => (int) ($order->total * 100),
            'currency' => 'INR',
            'receipt' => $order->order_no,
            'notes' => [
                'order_id' => $order->id,
                'customer_email' => $order->billing_json['email'] ?? null,
            ],
        ]);

        $order->update([
            'gateway' => 'razorpay',
            'gateway_order_id' => $razorpayOrder['id'],
        ]);

        return $razorpayOrder->toArray();
    }

    public function verifyPayment(array $payload): bool
    {
        $payment = $this->api->payment->fetch($payload['razorpay_payment_id']);

        return $payment['status'] === 'captured' || $payment['status'] === 'authorized';
    }

    public function capturePayment(string $paymentId, int $amount): void
    {
        $this->api->payment->fetch($paymentId)->capture($amount);
    }
}
