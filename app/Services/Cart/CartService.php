<?php

namespace App\Services\Cart;

use App\Models\Product;
use App\Services\Pricing\ProductPricingService;

class CartService
{
    protected const SESSION_KEY = 'cart.items';

    public function __construct(protected ProductPricingService $pricingService)
    {
    }

    public function getItems(): array
    {
        return session(self::SESSION_KEY, []);
    }

    public function add(Product $product, int $quantity): void
    {
        $items = $this->getItems();
        $quantity = max(1, $quantity);

        if (isset($items[$product->id])) {
            $items[$product->id]['qty'] += $quantity;
        } else {
            $items[$product->id] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'qty' => $quantity,
            ];
        }

        $items[$product->id] = $this->recalculateItem($product, $items[$product->id]['qty'], $items[$product->id]);

        session([self::SESSION_KEY => $items]);
    }

    public function updateQuantity(int $productId, int $quantity): void
    {
        $items = $this->getItems();

        if (! isset($items[$productId])) {
            return;
        }

        if ($quantity <= 0) {
            unset($items[$productId]);
            session([self::SESSION_KEY => $items]);
            return;
        }

        $product = Product::find($productId);
        if (! $product) {
            return;
        }

        $items[$productId] = $this->recalculateItem($product, $quantity, $items[$productId]);
        session([self::SESSION_KEY => $items]);
    }

    public function remove(int $productId): void
    {
        $items = $this->getItems();
        unset($items[$productId]);
        session([self::SESSION_KEY => $items]);
    }

    public function clear(): void
    {
        session([self::SESSION_KEY => []]);
    }

    public function count(): int
    {
        return array_sum(array_column($this->getItems(), 'qty'));
    }

    public function getSubtotal(): float
    {
        return array_sum(array_column($this->getItems(), 'subtotal'));
    }

    protected function recalculateItem(Product $product, int $qty, array $item): array
    {
        $pricing = $this->pricingService->calculatePrice($product, $qty);

        return array_merge($item, [
            'product_id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'qty' => $qty,
            'unit_price' => $pricing['unit_price'],
            'subtotal' => $pricing['subtotal'],
            'price_slab' => $pricing['slab'] ? $pricing['slab']->label : null,
        ]);
    }
}
