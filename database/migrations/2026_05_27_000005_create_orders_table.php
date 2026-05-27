<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('order_no')->unique();
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('wallet_discount', 12, 2)->default(0);
            $table->decimal('prepaid_discount', 12, 2)->default(0);
            $table->decimal('credit_used', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->string('payment_status')->default('pending_payment');
            $table->string('order_status')->default('pending');
            $table->string('gateway')->nullable();
            $table->string('gateway_order_id')->nullable();
            $table->string('gateway_payment_id')->nullable();
            $table->string('invoice_no')->nullable();
            $table->string('gst_no')->nullable();
            $table->addColumn('jsonb', 'billing_json')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
