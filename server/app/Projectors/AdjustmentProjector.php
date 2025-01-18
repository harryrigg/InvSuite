<?php

namespace App\Projectors;

use AdjustmentEvent;
use App\Events\InventoryItemAddStock;
use App\Events\InventoryItemSetStock;
use App\Events\InventoryItemSubtractStock;
use App\Models\Adjustment;
use App\Models\InventoryItem;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class AdjustmentProjector extends Projector
{
    public function onSetStock(InventoryItemSetStock $event): void
    {
        $adjustment = static::createAdjustment($event, 'set');
        $adjustment->writeable()->save();
    }

    public function onAddStock(InventoryItemAddStock $event): void
    {
        $adjustment = static::createAdjustment($event, 'add');
        $adjustment->writeable()->save();
    }

    public function onSubtractStock(InventoryItemSubtractStock $event): void
    {
        $adjustment = static::createAdjustment($event, 'subtract');
        $adjustment->writeable()->save();
    }

    public function resetState(?string $aggregateUuid = null): void
    {
        if ($aggregateUuid === null) {
            Adjustment::truncate();
        } else {
            InventoryItem::findByUuid($aggregateUuid)->adjustments()->delete();
        }
    }

    private static function createAdjustment(ShouldBeStored&AdjustmentEvent $event, string $type): Adjustment
    {
        return new Adjustment([
            'inventory_item_id' => InventoryItem::findByUuid($event->aggregateRootUuid())->id,
            'created_at' => $event->createdAt(),
            'type' => $type,
            'amount' => $event->amount,
            'stock_count' => $event->stockCount,
            'reason' => $event->reason,
        ]);
    }
}
