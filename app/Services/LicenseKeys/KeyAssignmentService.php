<?php

namespace App\Services\LicenseKeys;

use App\Models\LicenseKey;
use App\Models\Order;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Carbon;

class KeyAssignmentService
{
    public function __construct(protected DatabaseManager $db)
    {
    }

    public function assignKeysForOrder(Order $order): void
    {
        $this->db->transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $availableKeys = LicenseKey::where('product_id', $item->product_id)
                    ->where('status', 'available')
                    ->lockForUpdate()
                    ->limit($item->qty)
                    ->get();

                if ($availableKeys->count() < $item->qty) {
                    throw new \RuntimeException('Insufficient license key stock for product: ' . $item->product_name_snapshot);
                }

                foreach ($availableKeys as $key) {
                    $key->order_item_id = $item->id;
                    $key->status = 'sold';
                    $key->sold_at = Carbon::now();
                    $key->save();
                }
            }
        });
    }
}
