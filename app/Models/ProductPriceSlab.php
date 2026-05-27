<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductPriceSlab extends Model
{
    protected $fillable = [
        'product_id',
        'qty',
        'unit_price',
        'label',
        'is_popular',
        'is_hot',
        'sort_order',
    ];

    protected $casts = [
        'is_popular' => 'boolean',
        'is_hot' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
