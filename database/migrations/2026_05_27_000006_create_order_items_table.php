<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('product_name_snapshot');
            $table->integer('qty');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('total', 12, 2);
            $table->timestamps();

            Schema::table('license_keys', function (Blueprint $table) {
                $table->foreign('order_item_id')->references('id')->on('order_items')->nullOnDelete();
            });
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
