<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_no',
        'subtotal',
        'wallet_discount',
        'prepaid_discount',
        'credit_used',
        'tax_amount',
        'total',
        'payment_status',
        'order_status',
        'gateway',
        'gateway_order_id',
        'gateway_payment_id',
        'invoice_no',
        'gst_no',
        'billing_json',
    ];

    protected $casts = [
        'billing_json' => 'array',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
