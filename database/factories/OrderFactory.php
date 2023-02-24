<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {

        $subtotal = fake()->numberBetween(1000, 10000);
        $delivery = fake()->numberBetween(100, 1000);
        //$delivery_date = new Carbon(fake()->dateTimeBetween('+1 day', '+5 days'));
        return [
            'user_id' => User::factory(),
            'payment_type' => 'cash',
            'address_id' => Address::factory(),
            'subtotal' => $subtotal,
            'delivery_charge' => $delivery,
            'total' => $subtotal + $delivery,
            'delivery_date' => fake()->dateTimeBetween('+1 day', '+5 days'),
            'time_slot' => fake()->numberBetween(0,3),
            'status' => 'created',
        ];
    }
}
