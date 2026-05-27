<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LicenseKey;
use App\Models\LicenseKeyBatch;
use App\Models\Product;
use App\Services\LicenseKeys\AuditService;
use Illuminate\Http\Request;

class LicenseKeyController extends Controller
{
    public function index()
    {
        $products = Product::where('is_active', true)->get();
        $batches = LicenseKeyBatch::with('product')->latest()->paginate(15);

        return view('admin.license_keys.index', compact('products', 'batches'));
    }

    public function import(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'batch_name' => 'nullable|string|max:255',
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $productId = $request->input('product_id');
        $batchName = $request->input('batch_name') ?? 'Batch ' . now()->format('Y-m-d H:i');
        $path = $request->file('file')->getRealPath();

        $batch = LicenseKeyBatch::create([
            'product_id' => $productId,
            'batch_name' => $batchName,
            'total_keys' => 0,
            'imported_count' => 0,
            'available_count' => 0,
            'status' => 'importing',
            'imported_by' => auth()->id(),
        ]);

        $count = 0;
        if (($handle = fopen($path, 'r')) !== false) {
            while (($row = fgetcsv($handle)) !== false) {
                $value = trim($row[0] ?? '');
                if ($value === '') {
                    continue;
                }

                LicenseKey::create([
                    'product_id' => $productId,
                    'batch_id' => $batch->id,
                    'key_encrypted' => encrypt($value),
                    'status' => 'available',
                ]);

                $count++;
            }
            fclose($handle);
        }

        $batch->update([
            'total_keys' => $count,
            'imported_count' => $count,
            'available_count' => $count,
            'status' => 'completed',
        ]);

        AuditService::log('import', 'LicenseKeyBatch', $batch->id, [
            'batch_name' => $batchName,
            'product_id' => $productId,
            'total_keys' => $count,
        ]);

        return redirect()->route('admin.license-keys.index')->with('success', "Imported {$count} license keys in batch '{$batchName}'.");
    }

    public function export(LicenseKeyBatch $batch)
    {
        $keys = $batch->keys()->where('status', '!=', 'deleted')->get();

        $filename = "batch-{$batch->id}-export-" . now()->format('Y-m-d-His') . '.csv';
        $handle = fopen('php://memory', 'r+');

        fputcsv($handle, ['Key', 'Status', 'Sold At']);

        foreach ($keys as $key) {
            fputcsv($handle, [
                $key->decrypted_key,
                $key->status,
                $key->sold_at ? $key->sold_at->format('Y-m-d H:i:s') : null,
            ]);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        AuditService::log('export', 'LicenseKeyBatch', $batch->id, ['exported_count' => $keys->count()]);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    public function auditLog()
    {
        $logs = \App\Models\AuditLog::with('user')
            ->where('model_type', 'LicenseKeyBatch')
            ->latest()
            ->paginate(50);

        return view('admin.license_keys.audit_log', compact('logs'));
    }
}
