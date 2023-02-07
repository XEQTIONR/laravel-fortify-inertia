<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
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
                    'bangla_name' => $key,
                    'parent_id' => $parent,
                    'image' => \Faker\Factory::create()
                        ->imageUrl(500,500, $key, false, 'category', true),
                    'status' => 'active',
                ]);
            $this->traverse($val, $category->id);
        }
    }
    public function run()
    {
        Supplier::factory(50)->create();
        $this->traverse($this->hierarchy);
    }
}
