<?php

namespace App\Http\Controllers;

use App\Http\Requests\PurchaseOrderRequest;
use App\Http\Resources\PurchaseOrderLineResource;
use App\Http\Resources\PurchaseOrderResource;
use App\Models\InventoryItem;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        $purchaseOrders = $request->user()->purchaseOrders()->get();

        return PurchaseOrderResource::collection($purchaseOrders);
    }

    public function store(PurchaseOrderRequest $request)
    {
        $purchaseOrder = $request->user()
            ->purchaseOrders()
            ->create($request->except(['lines']));

        $purchaseOrder->lines()->createMany(array_map(function ($line) {
            $item = InventoryItem::findByUlid($line['item_id']);
            return [
                ...$line,
                'item_id' => $item->id,
            ];
        }, $request->lines));

        return response()->json(new PurchaseOrderResource($purchaseOrder), 201);
    }

    public function show(PurchaseOrder $purchaseOrder)
    {
        return new PurchaseOrderResource($purchaseOrder);
    }

    public function destroy(PurchaseOrder $purchaseOrder)
    {
        $purchaseOrder->delete();
    }

    public function indexLines(PurchaseOrder $purchaseOrder)
    {
        return PurchaseOrderLineResource::collection($purchaseOrder->lines);
    }
}
