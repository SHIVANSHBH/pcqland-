<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Pricing\ProductPricingService;
use Illuminate\Http\Request;

class ProductPricingController extends Controller
{
    public function calculate(Request $request, int $id, ProductPricingService $pricingService)
    {
        $request->validate(['qty' => 'required|integer|min:1']);

        $product = Product::findOrFail($id);
        $result = $pricingService->calculatePrice($product, (int) $request->query('qty'));

        return response()->json([
            'unit_price' => $result['unit_price'],
            'subtotal' => $result['subtotal'],
            'slab' => $result['slab'],
        ]);
    }
}
