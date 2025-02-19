<?php

namespace App\Models;

use App\PurchaseOrderStatus;
use Carbon\CarbonImmutable;
use HasUlid;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

/**
 * Database Attributes
 * @property string $reference
 * @property string $supplier
 * 
 * @property ?CarbonImmutable $ordered_at
 * @property ?CarbonImmutable $received_at
 * @property ?CarbonImmutable $cancelled_at
 * 
 * Computed Attributes
 * @property-read PurchaseOrderStatus $status
 * 
 * Relations
 * @property-read User $user
 * @property-read Collection<int,PurchaseOrderLine> $lines
 */
class PurchaseOrder extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseOrderFactory> */
    use HasFactory;
    use HasUlid;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'ordered_at' => 'immutable_datetime',
            'received_at' => 'immutable_datetime',
            'cancelled_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (PurchaseOrder $purchaseOrder) {
            if ($purchaseOrder->reference === null) {
                $nextReference = static::getNextReference($purchaseOrder->user);
                $purchaseOrder->reference = $nextReference;
            }
        });
    }

    protected function status(): Attribute
    {
        return Attribute::make(function () {
            return match (true) {
                $this->cancelled_at !== null => PurchaseOrderStatus::Cancelled,
                $this->received_at !== null => PurchaseOrderStatus::Received,
                $this->ordered_at !== null => PurchaseOrderStatus::Ordered,
                default => PurchaseOrderStatus::Draft,
            };
        });
    }

    /**
     * @return BelongsTo<User,$this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<PurchaseOrderLine,$this>
     */
    public function lines(): HasMany
    {
        return $this->hasMany(PurchaseOrderLine::class);
    }

    protected static function getNextReference(User $user): string
    {
        DB::table('purchase_order_reference_counter')
            ->upsert(['user_id' => $user->id], ['user_id']);

        $nextId = DB::scalar('UPDATE purchase_order_reference_counter SET reference = reference + 1 WHERE user_id = 1 RETURNING reference');

        return str_pad("$nextId", 6, '0', STR_PAD_LEFT);
    }
}
