<?php

use App\Http\Controllers\AdjustmentController;
use App\Http\Controllers\InventoryItemController;
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
});
