<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Traits\HierarchicalCategoriesTrait;
use Inertia\Inertia;

class HomeController extends Controller
{
    use HierarchicalCategoriesTrait;

    public function index($slug = null) {
        $category = Category::where('slug', $slug)->first();
        return Inertia::render( 'Home', [
            'categories' => $this->categoryTree(),
            'category' => $category ? new CategoryResource($category) : null
        ] );
    }
}
