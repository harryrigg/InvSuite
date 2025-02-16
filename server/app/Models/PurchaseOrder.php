<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

/**
 * @property string $reference
 * @property string $supplier
 * 
 * @property ?CarbonImmutable $fulfilled_at
 * 
 * @property-read User $user
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
            'fulfilled_at' => 'immutable_datetime',
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

    /**
     * @return BelongsTo<User,$this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function getNextReference(User $user): string
    {
        DB::table('purchase_order_reference_counter')
            ->upsert(['user_id' => $user->id], ['user_id']);

        $nextId = DB::scalar('UPDATE purchase_order_reference_counter SET reference = reference + 1 WHERE user_id = 1 RETURNING reference');

        return str_pad("$nextId", 6, '0', STR_PAD_LEFT);
    }
}
