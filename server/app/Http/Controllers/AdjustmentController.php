<?php

namespace App\Http\Controllers;

use App\Aggregates\InventoryItemStockAggregate;
use App\Exceptions\IllegalStockAdjustmentException;
use App\Http\Requests\AdjustmentRequest;
use App\Models\InventoryItem;
use Illuminate\Validation\ValidationException;

class AdjustmentController extends Controller
{
    public function index(InventoryItem $inventoryItem)
    {
        return $inventoryItem->adjustments()->latest()->orderBy('id', 'desc')->get();
    }

    public function store(AdjustmentRequest $request, InventoryItem $inventoryItem)
    {
        $aggregate = InventoryItemStockAggregate::retrieve($inventoryItem['uuid']);
        try {
            switch ($request['type']) {
                case 'set':
                    $aggregate->setStock($request['amount'], $request['reason']);
                    break;
                case 'add':
                    $aggregate->addStock($request['amount'], $request['reason']);
                    break;
                case 'subtract':
                    $aggregate->subtractStock($request['amount'], $request['reason']);
                    break;
            }
            $aggregate->persist();
        } catch (IllegalStockAdjustmentException) {
            throw ValidationException::withMessages([
                'amount' => ['Can not subtract more than current stock'],
            ]);
        }
    }
}
