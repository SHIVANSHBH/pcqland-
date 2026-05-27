<?php

namespace App\Services\Notifications;

use App\Models\Order;

class WhatsAppService
{
    public function sendOrderConfirmation(Order $order): void
    {
        $message = $this->buildMessage($order);
        $phone = $this->normalizePhone($order->billing_json['phone'] ?? '');

        if (empty($phone)) {
            return;
        }

        $this->send($phone, $message);
    }

    protected function buildMessage(Order $order): string
    {
        $lines = [];
        $lines[] = "✅ *Order Confirmed!*";
        $lines[] = "Order: {$order->order_no}";
        $lines[] = "Amount: ₹" . number_format($order->total, 2);
        $lines[] = "";

        foreach ($order->items as $item) {
            $lines[] = "{$item->product_name_snapshot} x{$item->qty}";
            foreach ($item->licenseKeys as $key) {
                $lines[] = "  🔑 `{$key->license_key}`";
            }
        }

        $lines[] = "";
        $lines[] = "Thank you for your purchase!";
        $lines[] = "- PCQLand Team";

        return implode("\n", $lines);
    }

    public function sendLicenseKeys(Order $order): void
    {
        $phone = $this->normalizePhone($order->billing_json['phone'] ?? '');

        if (empty($phone)) {
            return;
        }

        $lines = [];
        $lines[] = "🔑 *Your License Keys Are Ready*";
        $lines[] = "Order: {$order->order_no}";
        $lines[] = "";

        foreach ($order->items as $item) {
            $lines[] = "*{$item->product_name_snapshot}*:";
            foreach ($item->licenseKeys as $key) {
                $lines[] = "  `{$key->license_key}`";
            }
        }

        $lines[] = "";
        $lines[] = "Save these keys. You can also view them in your account.";
        $lines[] = "- PCQLand Team";

        $this->send($phone, implode("\n", $lines));
    }

    protected function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (strlen($phone) === 10) {
            return '91' . $phone;
        }

        if (strlen($phone) === 12 && str_starts_with($phone, '91')) {
            return $phone;
        }

        return '';
    }

    protected function send(string $phone, string $message): void
    {
        $url = 'https://api.whatsapp.com/send?phone=' . $phone . '&text=' . urlencode($message);
        \Illuminate\Support\Facades\Log::info('WhatsApp delivery URL: ' . $url);
    }
}
