<?php

use App\Http\Controllers\AdjustmentController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\PurchaseOrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('inventory/{inventoryItem}/image')->group(function () {
        Route::get('', [InventoryItemController::class, 'showImage']);
        Route::post('', [InventoryItemController::class, 'storeImage']);
        Route::delete('', [InventoryItemController::class, 'deleteImage']);
    });
    Route::apiResource('inventory', InventoryItemController::class);

    // Adjustments
    Route::prefix('inventory/{inventoryItem}/adjustment')->group(function () {
        Route::get('', [AdjustmentController::class, 'index']);
        Route::post('', [AdjustmentController::class, 'store']);
    });

    // Purchase Orders
    Route::get('purchase-order', [PurchaseOrderController::class, 'index']);
    Route::get('purchase-order/{purchaseOrder}', [PurchaseOrderController::class, 'show']);
    Route::put('purchase-order/{purchaseOrder}', [PurchaseOrderController::class, 'update']);
    Route::post('purchase-order/{purchaseOrder}/receipt', [PurchaseOrderController::class, 'receipt']);
    Route::delete('purchase-order/{purchaseOrder}', [PurchaseOrderController::class, 'destroy']);
    Route::post('purchase-order', [PurchaseOrderController::class, 'store']);
    Route::post('purchase-order/{purchaseOrder}/mark-ordered', [PurchaseOrderController::class, 'markOrdered']);
    Route::post('purchase-order/{purchaseOrder}/cancel', [PurchaseOrderController::class, 'cancel']);
    Route::get('purchase-order/{purchaseOrder}/lines', [PurchaseOrderController::class, 'indexLines']);
});
