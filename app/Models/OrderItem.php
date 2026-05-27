<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'product_name_snapshot',
        'qty',
        'unit_price',
        'total',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function licenseKeys()
    {
        return $this->hasMany(LicenseKey::class, 'order_item_id', 'id');
    }
}
