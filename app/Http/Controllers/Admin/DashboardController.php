<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LicenseKeyBatch;
use App\Models\Order;
use App\Models\LicenseKey;

class DashboardController extends Controller
{
    public function index()
    {
        $pendingOrdersCount = Order::where('order_status', 'pending')->count();
        $pendingPaymentsCount = Order::where('payment_status', 'pending_payment')->count();
        $lowStockBatchCount = LicenseKeyBatch::where('available_count', '<', 10)->count();
        $availableLicenseKeyCount = LicenseKey::where('status', 'available')->count();

        return view('admin.dashboard', compact(
            'pendingOrdersCount',
            'pendingPaymentsCount',
            'lowStockBatchCount',
            'availableLicenseKeyCount'
        ));
    }
}
