<?php

namespace App\Models;

use HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $quantity
 * 
 * @property-read PurchaseOrder $purchaseOrder
 * @property-read InventoryItem $item
 */
class PurchaseOrderLine extends Model
{
    use HasUlid;

    protected $guarded = [];

    /**
     * @return BelongsTo<PurchaseOrder,$this>
     */
    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    /**
     * @return BelongsTo<InventoryItem,$this>
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
