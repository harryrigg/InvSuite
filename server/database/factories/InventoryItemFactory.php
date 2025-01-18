<?php

namespace Database\Factories;

use App\Aggregates\InventoryItemStockAggregate;
use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryItem>
 */
class InventoryItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sku' => $this->faker->unique()->regexify('[A-Z]{1,2}[0-9]{3}'),
            'name' => $this->faker->unique()->randomElement([
                'Chocolate Biscuits 200g',
                'Yeast Extract Spread 220g',
                'Wholegrain Cereal 1.2kg',
                'Rolled Oats 1kg',
                'Breakfast Drink 250ml',
                'Potato Chips 170g',
                'Canned Pineapple Slices 450g',
                'Cheddar Cheese 500g',
                'Full Cream Milk 1L',
                'Bottled Water 600ml',
                'White Bread 700g',
                'Corn Flakes 725g',
                'Milk Chocolate Bar 180g',
                'Chocolate Malt Powder 1kg',
                'Canned Tuna 95g',
                'Jasmine Rice 1kg',
                'Frozen Green Peas 500g',
                'Meat Pies 700g',
                'Vanilla Ice Cream 2L',
                'English Muffins 6 pack',
                'Wholemeal Bread 850g',
                'Full Cream Milk 2L',
                'Yogurt 1kg',
                'Frozen Pizza 500g',
                'Instant Soup 4 pack',
                'Tomato Sauce 500ml',
                'Orange Juice 2L',
                'Savory Crackers 190g',
                'Salted Butter 250g',
                'Peanut Butter 375g',
                'Black Tea Bags 100 pack',
                'Flavored Milk Powder 500g',
                'Pasta 500g',
                'Taco Kit 520g',
                'Frozen Fish Fingers 375g',
                'Frozen Mixed Vegetables 1kg',
                'Thickened Cream 600ml',
                'Eggs 12 pack',
                'White Sugar 1kg',
                'Plain Flour 1kg',
                'Olive Oil 1L',
                'Canned Diced Tomatoes 400g',
                'Canned Baked Beans 420g',
                'Spaghetti 500g',
                'Canned Tuna 95g',
                'Instant Coffee 200g',
                'Tea Bags 100 pack',
                'Dishwashing Liquid 1L',
                'Paper Towels 2 pack',
                'Toilet Paper 12 pack',
                'Laundry Powder 1kg',
                'Fabric Softener 2L',
                'Garbage Bags 50 pack',
                'Aluminium Foil 30m',
                'Cling Wrap 60m',
                'Baking Paper 15m',
                'Freezer Bags 100 pack',
                'Sandwich Bags 150 pack',
                'Napkins 100 pack',
                'Tissues 200 pack',
                'Hand Wash 500ml',
                'Shampoo 1L',
                'Conditioner 1L',
                'Body Wash 1L',
                'Toothpaste 200g',
                'Mouthwash 1L',
                'Deodorant 250ml',
                'Shaving Cream 200g'
            ]),
            'description' => $this->faker->sentence(),
        ];
    }

    public function withAdjustments(?int $count = null): Factory
    {
        $count = $count ?? $this->faker->numberBetween(1, 50);
        return $this->afterCreating(function (InventoryItem $item) use ($count) {
            $addReasons = [
                'Restocking',
                'Received PO #P12345',
                'Customer return',
                'Transfer',
            ];

            $subtractReasons = [
                'Sales Order #S12345',
                'Damaged',
                'Expired',
                'Lost',
                'Transfer',
            ];

            $aggregate = InventoryItemStockAggregate::retrieve($item['uuid']);
            $totalCount = 0;
            for ($i = 0; $i < $count; $i++) {
                $adjustmentType = rand(0, 9);
                if ($adjustmentType < 4) {
                    // 2/5 chance of adding stock 
                    $amount = $this->faker->numberBetween(0, 100);
                    $aggregate->addStock($amount, $this->faker->randomElement($addReasons));
                    $totalCount += $amount;
                } else if ($adjustmentType < 7) {
                    // 2/5 chance of subtracting stock
                    if ($totalCount === 0) {
                        // If there is no stock, skip
                        $count += 1;
                        continue;
                    }
                    $amount = $this->faker->numberBetween(0, $totalCount);
                    $aggregate->subtractStock($amount, $this->faker->randomElement($subtractReasons));
                    $totalCount -= $amount;
                } else {
                    // 1/5 chance of setting stock
                    $amount = $this->faker->numberBetween(0, 100);
                    $aggregate->setStock($amount, 'Stocktake');
                    $totalCount = $amount;
                }
            }
            $aggregate->persist();
        });
    }
}
