<?php

use App\Models\InventoryItem;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('adjustments', function (Blueprint $table) {
            $table->id();
            $table->ulid()->unique();

            $table->foreignIdFor(InventoryItem::class);

            $table->nullableMorphs('sourceable');

            $table->enum('type', ['add', 'subtract', 'set']);
            $table->integer('amount');
            $table->integer('stock_count');
            $table->string('reason')->nullable();

            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adjustments');
    }
};
