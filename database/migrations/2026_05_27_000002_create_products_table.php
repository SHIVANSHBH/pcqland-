<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image_path')->nullable();
            $table->text('short_description')->nullable();
            $table->text('description_html')->nullable();
            $table->text('activation_html')->nullable();
            $table->addColumn('jsonb', 'features_json')->nullable();
            $table->integer('min_qty')->default(1);
            $table->integer('max_qty')->default(100);
            $table->decimal('base_price', 12, 2)->default(0);
            $table->decimal('cashback_per_unit', 12, 2)->default(0);
            $table->boolean('is_special_product')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
