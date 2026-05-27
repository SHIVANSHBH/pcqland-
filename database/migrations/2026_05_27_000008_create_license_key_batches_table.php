<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('license_key_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('batch_name');
            $table->integer('total_keys')->default(0);
            $table->integer('imported_count')->default(0);
            $table->integer('available_count')->default(0);
            $table->integer('sold_count')->default(0);
            $table->string('status')->default('pending');
            $table->foreignId('imported_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('license_key_batches');
    }
};
