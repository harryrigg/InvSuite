<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

/**
 * @mixin \App\Models\PurchaseOrder
 */
class PurchaseOrderResource extends Resource
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

            'reference' => $this->reference,
            'supplier' => $this->supplier,

            'ordered_at' => $this->ordered_at,
            'received_at' => $this->received_at,
            'cancelled_at' => $this->cancelled_at,

            'status' => $this->status,

            'created_at' => $this->created_at,
        ];
    }
}
