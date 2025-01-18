<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->has(InventoryItem::factory(50)->withAdjustments())->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
