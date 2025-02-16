<?php

use Illuminate\Database\Eloquent\Concerns\HasUlids;

trait HasUlid
{
    use HasUlids;

    public function getRouteKeyName(): string
    {
        return 'ulid';
    }

    public function uniqueIds()
    {
        return ['ulid'];
    }

    public static function findByUlid(string $ulid): ?self
    {
        return static::where('ulid', $ulid)->first();
    }
}
