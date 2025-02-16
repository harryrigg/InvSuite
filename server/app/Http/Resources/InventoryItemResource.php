<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * @mixin \App\Models\InventoryItem
 */
class InventoryItemResource extends Resource
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
            'sku' => $this->sku,
            'name' => $this->name,
            'description' => $this->description,
            'stock_count' => $this->stock_count,
            'latest_adjustment_date' => $this->latest_adjustment_date,
        ];
    }
}
