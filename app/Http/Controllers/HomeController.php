<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Traits\HierarchicalCategoriesTrait;
use Inertia\Inertia;

class HomeController extends Controller
{
    use HierarchicalCategoriesTrait;

    public function index($slug = null) {
        $category = Category::where('slug', $slug)->first();
        $products = ProductResource::collection(Product::all());

        return Inertia::render( 'Home', [
            'categories' => $this->categoryTree(),
            'category' => $category ? new CategoryResource($category) : null,
            'products' => $products,
        ] );
    }
}
