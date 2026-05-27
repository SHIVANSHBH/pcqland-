<?php

namespace App\Services\Pricing;

use App\Models\Product;

class ProductPricingService
{
    public function calculatePrice(Product $product, int $quantity): array
    {
        $slab = $product->priceSlabs()
            ->where('qty', '<=', $quantity)
            ->orderByDesc('qty')
            ->first();

        $unitPrice = $slab ? $slab->unit_price : $product->base_price;
        $subtotal = $quantity * $unitPrice;

        return [
            'unit_price' => $unitPrice,
            'subtotal' => $subtotal,
            'slab' => $slab,
        ];
    }
}
