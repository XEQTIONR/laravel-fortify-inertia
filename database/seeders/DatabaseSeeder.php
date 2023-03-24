<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Staff;
use App\Models\Supplier;
use App\Models\User;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    //use WithoutModelEvents;
    /**
     * Seed the application's database.
     *
     * @return void
     */

    private array $hierarchy = [
        'Adsad' => [
            'Efdfs' => [
                'Kfdsfs' => [],
                'Lfrec' => [],
                'Tcdccs' => [],
                'Mcds cds' => [
                    'Ucsdcsd' => []
                ]
            ]
        ],
        'Bccew' => [
            'Fcdscs' => [
                'Ncece' => [],
                'Vcs cds' => []
            ],
            'Gcsdc' => [
                'Ovfdv' => [],
                'Pvvtr' => [
                    'Wiopi' => [
                        'Xvdfvvd' => []
                    ]
                ]
            ],
        ],
        'Cjiojo' => [],
        'Djojo' => [
            'Hvfdvdf' => [
                'Qvdfv' => [],
                'Yvdfvdfv' => []
            ],
            'Ivdvdf' => [],
            'Jnooi' => [
                'Rvfvijo' => [
                    'Zvfdvjo' => []
                ],
                'Sijioj' => []
            ],
        ]
    ];
    private function traverse($tree, $parent = null) {
        $suppliers = Supplier::all();
        $bangla_faker = new \Xeqtionr\BanglaFaker\BanglaFaker();
        foreach($tree as $key => $val) {
            $random = rand(1, 5);
            $random2 = rand(1, 10);
            $someSuppliers = $suppliers->random($random);
            $category = \App\Models\Category::factory()
                ->has(Product::factory()
                    ->hasAttached($someSuppliers)
                    ->count($random2)
                )
                ->create([
                    'english_name' => $key,
                    'slug' => str_replace(' ', '-', strtolower($key)),
                    'bangla_name' => $bangla_faker->words(rand(1,2), true),
                    'parent_id' => $parent,
                    //'image' => \Faker\Factory::create()->imageUrl(500,500, $key, false, 'category', true),
                    'image' => 'http://satyr.dev/500x500/'
                        . substr(fake()->hexColor(), 1)
                        .'?text=category+'
                        . str_replace(' ', '+', $key),
                    'status' => 'active',
                ]);
            $this->traverse($val, $category->id);
        }
    }
    public function run()
    {
        Staff::create([
            'name' => 'Staff',
            'email' => 'staff@gmail.com',
            'mobile_number' => '01815440669',
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        ]);
        Supplier::factory(25)->create();
        $this->traverse($this->hierarchy);

        User::factory(50)
            ->has(Address::factory()
                ->has(Order::factory()
                    ->has(OrderItem::factory()
                        ->count(fake()->numberBetween(1,5))
                        ->state( function( array $attributes, Order $order ) {
                            $product = Product::inRandomOrder()->first();
                            return [
                                'order_id' => $order->id,
                                'product_id' => $product->id,
                                'price' => $product->current_selling_price,
                            ];
                        }),
                        'items'
                    )
                    ->count(2)
                    ->state( function( array $attributes, Address $address ) {
                        return ['user_id' => $address->user->id];
                    })
                )
            )
            ->create();
    }
}
