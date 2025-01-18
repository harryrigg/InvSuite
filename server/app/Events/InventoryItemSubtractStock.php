<?php

namespace App\Events;

use AdjustmentEvent;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class InventoryItemSubtractStock extends ShouldBeStored implements AdjustmentEvent
{
    /**
     * Create a new event instance.
     */
    public function __construct(
        public int $amount,
        public int $stockCount,
        public string $reason,
    ) {}
}
