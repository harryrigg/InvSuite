<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * @mixin \App\Models\PurchaseOrderLine
 */
class PurchaseOrderLineResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->ulid,
            'purchase_order_id' => $this->purchaseOrder->id,
            'item_id' => $this->item->ulid,
            'item_sku' => $this->item->sku,
            'item_name' => $this->item->name,
            'quantity' => $this->quantity,
            ...($this->purchaseOrder->received_at !== null ? ['received_quantity' => $this->received_quantity] : []),
        ];
    }
}
