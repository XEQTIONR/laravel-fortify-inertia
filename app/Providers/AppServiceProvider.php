<?php

namespace App\Providers;

use App\Contracts\HierarchicalCategories;
use App\Contracts\PDFCreator;
use App\Models\Category;
use App\Services\HierarchicalCategoriesService;
use App\Services\PDF;
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

        app()->bind(PDF::class, function() {
            return new PDF('P', 'mm', 'A4');
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
