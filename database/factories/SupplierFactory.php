<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplier>
 */
class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'contact_name'           => fake()->name(),
            'business_name'          => fake()->company(),
            'address'                =>  fake()->streetAddress(),
            'email'                  => fake()->email(),
            'primary_contact_number' => fake()->phoneNumber(),
            'status'                 => 'active'
        ];
    }
}
