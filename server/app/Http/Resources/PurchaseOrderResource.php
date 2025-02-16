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
            'fulfilled_at' => $this->fulfilled_at,
            'created_at' => $this->created_at,
        ];
    }
}
