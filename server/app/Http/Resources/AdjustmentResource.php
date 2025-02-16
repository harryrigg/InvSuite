<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * @mixin \App\Models\Adjustment
 */
class AdjustmentResource extends Resource
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
            'inventory_item_id' => $this->inventoryItem->getRouteKey(),
            'type' => $this->type,
            'amount' => $this->amount,
            'stock_count' => $this->stock_count,
            'reason' => $this->reason,
            'created_at' => $this->created_at,
        ];
    }
}
