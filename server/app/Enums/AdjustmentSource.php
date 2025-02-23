<?php

namespace App\Enums;

use App\Models\PurchaseOrder;

enum AdjustmentSource: string
{
    case Manual = 'manual';
    case PurchaseOrder = 'purchase_order';
    case SalesOrder = 'sales_order';

    public static function fromClass(string|null $class): static
    {
        return match ($class) {
            PurchaseOrder::class => static::PurchaseOrder,
            'App\Models\SalesOrder' => static::SalesOrder,
            default => static::Manual,
        };
    }
}
