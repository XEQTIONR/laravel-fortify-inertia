<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $faker = \Faker\Factory::create();
        $faker->addProvider(new \FakerRestaurant\Provider\en_US\Restaurant($faker));
        $bangla_faker = new \Xeqtionr\BanglaFaker\BanglaFaker();
        $name = $faker->vegetableName();
        $uoms = array_keys( Product::$unitsOfMeasurement );
        return [
            'english_name' => $name,
            'bangla_name' => $bangla_faker->words(rand(1,3), true),
            'uom' => $uoms[rand(0, count($uoms) - 1)],
            'current_selling_price' => rand(10, 500) * 100,
            'in_stock' => rand(0, 100),
            'status' => 'active',
            'image' => fake()->imageUrl(500, 500, $name)
        ];
    }
}
