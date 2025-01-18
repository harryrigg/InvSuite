<?php

namespace App\Aggregates;

use App\Events\InventoryItemAddStock;
use App\Events\InventoryItemSetStock;
use App\Events\InventoryItemSubtractStock;
use App\Exceptions\IllegalStockAdjustmentException;
use Spatie\EventSourcing\AggregateRoots\AggregateRoot;

class InventoryItemStockAggregate extends AggregateRoot
{
    private int $count = 0;

    public function setStock(int $amount, string $reason): self
    {
        $this->recordThat(new InventoryItemSetStock($amount, $amount, $reason));
        return $this;
    }

    public function addStock(int $amount, string $reason): self
    {
        $this->recordThat(new InventoryItemAddStock($amount, $this->count + $amount, $reason));
        return $this;
    }

    public function subtractStock(int $amount, string $reason): self
    {
        if (!$this->ensureCanSubtractStock($amount)) {
            throw new IllegalStockAdjustmentException();
        }

        $this->recordThat(new InventoryItemSubtractStock($amount, $this->count - $amount, $reason));
        return $this;
    }

    // APPLY EVENTS
    public function applySetStock(InventoryItemSetStock $event): void
    {
        $this->count = $event->amount;
    }

    public function applyAddStock(InventoryItemAddStock $event): void
    {
        $this->count += $event->amount;
    }

    public function applySubtractStock(InventoryItemSubtractStock $event): void
    {
        $this->count -= $event->amount;
    }

    // BUSINESS RULES
    private function ensureCanSubtractStock(int $amount): bool
    {
        return $this->count >= $amount;
    }
}
