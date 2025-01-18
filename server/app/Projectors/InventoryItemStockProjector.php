<?php

namespace App\Projectors;

use App\Events\InventoryItemAddStock;
use App\Events\InventoryItemSetStock;
use App\Events\InventoryItemSubtractStock;
use App\Models\InventoryItem;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

class InventoryItemStockProjector extends Projector
{
    public function onSetStock(InventoryItemSetStock $event): void
    {
        $inventoryItem = InventoryItem::findByUuid($event->aggregateRootUuid());
        $inventoryItem->stock_count = $event->amount;
        $inventoryItem->save();
    }

    public function onAddStock(InventoryItemAddStock $event): void
    {
        $inventoryItem = InventoryItem::findByUuid($event->aggregateRootUuid());
        $inventoryItem->increment('stock_count', $event->amount);
    }

    public function onSubtractStock(InventoryItemSubtractStock $event): void
    {
        $inventoryItem = InventoryItem::findByUuid($event->aggregateRootUuid());
        $inventoryItem->decrement('stock_count', $event->amount);
    }
}
