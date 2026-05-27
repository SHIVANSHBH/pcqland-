<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LicenseKeyDeliveryMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order, public array $keys)
    {
    }

    public function envelope()
    {
        return [
            'subject' => "Your License Keys: {$this->order->order_no}",
        ];
    }

    public function content()
    {
        return view('emails.license_key_delivery', [
            'order' => $this->order,
            'keys' => $this->keys,
        ]);
    }
}
