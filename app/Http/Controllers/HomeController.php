<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\HomeController as Controller;
use App\Http\Traits\HierarchicalCategoriesTrait;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    use HierarchicalCategoriesTrait;

    public function index(Request $request, $slug = null) {

        return Inertia::render( 'Home', [
            'categories' => $this->categoryTree(Category::all()),
            'products' => parent::index($request, $slug),
        ]);
    }
}
