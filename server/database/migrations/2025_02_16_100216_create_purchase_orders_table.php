<?php

use App\Models\User;
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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->ulid()->unique();

            $table->string('reference')->unique();
            $table->string('supplier');

            $table->timestamp('fulfilled_at')->nullable();

            $table->foreignIdFor(User::class);

            $table->timestamps();
        });

        Schema::create('purchase_order_lines', function (Blueprint $table) {
            $table->id();
            $table->ulid()->unique();

            $table->foreignIdFor(App\Models\PurchaseOrder::class);
            $table->foreignIdFor(App\Models\InventoryItem::class, 'item_id');

            $table->integer('quantity');

            $table->timestamps();
        });

        Schema::create('purchase_order_reference_counter', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(App\Models\User::class)->unique();
            $table->integer('reference')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_order_reference_counter');
    }
};
