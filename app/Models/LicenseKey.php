<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LicenseKey extends Model
{
    protected $fillable = [
        'product_id',
        'batch_id',
        'key_encrypted',
        'status',
        'reserved_until',
        'order_item_id',
        'sold_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'reserved_until' => 'datetime',
        'sold_at' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getDecryptedKeyAttribute(): string
    {
        return decrypt($this->key_encrypted);
    }
}
