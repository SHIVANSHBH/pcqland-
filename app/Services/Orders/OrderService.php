<?php

namespace App\Services\Orders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\LicenseKeys\KeyAssignmentService;
use App\Services\Cart\CartService;
use App\Services\Notifications\WhatsAppService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(protected CartService $cartService, protected KeyAssignmentService $assignmentService)
    {
    }

    public function createPendingOrder(array $billing, ?int $userId = null): Order
    {
        $cartItems = $this->cartService->getItems();
        if (empty($cartItems)) {
            throw new \RuntimeException('Cart is empty.');
        }

        return DB::transaction(function () use ($billing, $userId, $cartItems) {
            $order = Order::create([
                'user_id' => $userId,
                'order_no' => 'PCQ' . strtoupper(Str::random(8)),
                'subtotal' => $this->cartService->getSubtotal(),
                'wallet_discount' => 0,
                'prepaid_discount' => 0,
                'credit_used' => 0,
                'tax_amount' => 0,
                'total' => $this->cartService->getSubtotal(),
                'payment_status' => 'pending_payment',
                'order_status' => 'pending',
                'gateway' => null,
                'billing_json' => $billing,
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name_snapshot' => $item['name'],
                    'qty' => $item['qty'],
                    'unit_price' => $item['unit_price'],
                    'total' => $item['subtotal'],
                ]);
            }

            return $order;
        });
    }

    public function completePayment(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $order->load('items');
            $this->assignmentService->assignKeysForOrder($order);

            $order->update([
                'payment_status' => 'paid',
                'order_status' => 'completed',
            ]);
        });

        $order->load('items.licenseKeys');
        app(WhatsAppService::class)->sendOrderConfirmation($order);

        $this->cartService->clear();
    }

    public function placeOrder(array $billing, ?int $userId = null): Order
    {
        $order = $this->createPendingOrder($billing, $userId);
        $this->completePayment($order);

        return $order;
    }
}
