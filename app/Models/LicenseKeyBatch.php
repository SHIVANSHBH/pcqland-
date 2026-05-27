<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LicenseKeyBatch extends Model
{
    protected $table = 'license_key_batches';

    protected $fillable = [
        'product_id',
        'batch_name',
        'total_keys',
        'imported_count',
        'available_count',
        'sold_count',
        'status',
        'imported_by',
        'notes',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function keys()
    {
        return $this->hasMany(LicenseKey::class, 'batch_id', 'id');
    }
}
