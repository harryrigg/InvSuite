<?php

trait HasUuid
{
    public static function findByUuid(string $uuid): ?self
    {
        return static::where('uuid', $uuid)->first();
    }
}
