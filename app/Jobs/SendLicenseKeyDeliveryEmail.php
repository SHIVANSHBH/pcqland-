<?php

namespace App\Jobs;

use App\Mail\LicenseKeyDeliveryMail;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendLicenseKeyDeliveryEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Order $order)
    {
    }

    public function handle(): void
    {
        $keys = [];
        foreach ($this->order->items as $item) {
            $itemKeys = $item->licenseKeys()->get();
            foreach ($itemKeys as $key) {
                $keys[] = [
                    'product' => $item->product_name_snapshot,
                    'key' => $key->decrypted_key,
                ];
            }
        }

        Mail::send(new LicenseKeyDeliveryMail($this->order, $keys));
    }
}
