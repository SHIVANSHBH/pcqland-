<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'image_path',
        'short_description',
        'description_html',
        'activation_html',
        'features_json',
        'min_qty',
        'max_qty',
        'base_price',
        'cashback_per_unit',
        'is_special_product',
        'is_active',
        'seo_title',
        'seo_description',
    ];

    protected $casts = [
        'features_json' => 'array',
        'is_special_product' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function priceSlabs()
    {
        return $this->hasMany(ProductPriceSlab::class);
    }
}
