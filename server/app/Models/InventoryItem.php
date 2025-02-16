<?php

namespace App\Models;

use HasUlid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryItemFactory> */
    use HasFactory;
    use HasUlid;

    protected $fillable = [
        'sku',
        'name',
        'description',
    ];

    protected $appends = [
        'latest_adjustment_date'
    ];

    protected function latestAdjustmentDate(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->adjustments()->latest()->orderBy('ulid', 'desc')->first()?->created_at
        );
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<Adjustment, $this>
     */
    public function adjustments(): HasMany
    {
        return $this->hasMany(Adjustment::class);
    }

    public static $image_path_prefix = 'images/inventory_items/';
}
