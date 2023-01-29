<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */

    private array $hierarchy = [
        'A' => [
            'E' => [
                'K' => [],
                'L' => [],
                'T' => [],
                'M' => [
                    'U' => []
                ]
            ]
        ],
        'B' => [
            'F' => [
                'N' => [],
                'V' => []
            ],
            'G' => [
                'O' => [],
                'P' => [
                    'W' => [
                        'X' => []
                    ]
                ]
            ],
        ],
        'C' => [],
        'D' => [
            'H' => [
                'Q' => [],
                'Y' => []
            ],
            'I' => [],
            'J' => [
                'R' => [
                    'Z' => []
                ],
                'S' => []
            ],
        ]
    ];
    private function traverse($tree, $parent = null) {
        foreach($tree as $key => $val) {
            $category = \App\Models\Category::factory()->create([
                'english_name' => $key,
                'bangla_name' => $key,
                'parent_id' => $parent,
                'image' => \Faker\Factory::create()->imageUrl(500, 500, $key, false),
                'status' => 'active',
            ]);
            $this->traverse($val, $category->id);
        }
    }
    public function run()
    {
        $this->traverse($this->hierarchy);

         \App\Models\Product::factory(100)->create();

         \App\Models\Supplier::factory(50)->create();
        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
