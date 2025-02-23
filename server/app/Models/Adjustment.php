<?php

namespace App\Models;

use App\Enums\AdjustmentSource;
use HasUlid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
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

    protected function source(): Attribute
    {
        return Attribute::make(fn() => AdjustmentSource::fromClass($this->sourceable_type));
    }

    protected function sourceReference(): Attribute
    {
        return Attribute::make(fn() => $this->sourceable?->reference);
    }

    /**
     * @return BelongsTo<InventoryItem, $this>
     */
    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }

    /**
     * @return MorphTo<PurchaseOrder,$this>
     */
    public function sourceable(): MorphTo
    {
        return $this->morphTo();
    }
}
