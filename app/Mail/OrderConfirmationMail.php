<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order)
    {
    }

    public function envelope()
    {
        return [
            'subject' => "Order Confirmation: {$this->order->order_no}",
        ];
    }

    public function content()
    {
        return view('emails.order_confirmation', ['order' => $this->order]);
    }
}
