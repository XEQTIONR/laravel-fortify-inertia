<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'full_name' => fake()->name(),
            'business_name' => fake()->company(),
            'address' => fake()->streetAddress()."\n".fake()->city()."\n".fake()->postcode(),
            'phone_number' => fake()->numerify('01#########'),
        ];
    }
}
