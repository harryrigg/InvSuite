<?php

namespace App\Models;

use HasUuid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryItemFactory> */
    use HasFactory;
    use HasUuid;

    protected $fillable = [
        'sku',
        'name',
        'description',
    ];

    protected $appends = [
        'latest_adjustment_date'
    ];

    protected function casts(): array
    {
        return [
            'id' => 'string'
        ];
    }

    public static function booted()
    {
        static::creating(function ($model) {
            $model->uuid = Str::uuid();
        });
    }

    protected function latestAdjustmentDate(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->adjustments()->latest()->orderBy('id', 'desc')->first()?->created_at
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
