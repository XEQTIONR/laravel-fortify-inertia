<?php

namespace App\Providers;

use App\Contracts\HierarchicalCategories;
use App\Models\Category;
use App\Services\HierarchicalCategoriesService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        app()->singleton(HierarchicalCategories::class, function() {
            $service = new HierarchicalCategoriesService();

            return $service->categoryTree(Category::all());
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
