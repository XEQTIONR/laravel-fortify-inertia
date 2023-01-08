<?php

namespace Database\Factories;

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
        return [
            'english_name' => $name,
            'bangla_name' => $bangla_faker->words(rand(1,3), true),
            'uom' => rand(1,5),
            'current_selling_price' => rand(10, 500) * 100,
            'in_stock' => rand(0, 100),
            'image' => fake()->imageUrl(500, 500, $name)
        ];
    }
}
