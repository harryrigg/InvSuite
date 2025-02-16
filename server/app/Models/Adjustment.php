<?php

namespace App\Models;

use HasUlid;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\EventSourcing\Projections\Projection;

class Adjustment extends Projection
{
    use HasUlid;

    public $timestamps = false;

    protected $guarded = [];

    public function getKeyName(): string
    {
        return 'ulid';
    }

    /**
     * @return BelongsTo<InventoryItem, $this>
     */
    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
