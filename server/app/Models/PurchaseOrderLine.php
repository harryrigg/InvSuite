<?php

namespace App\Models;

use HasUlid;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderLine extends Model
{
    use HasUlid;

    protected $guarded = [];
}
