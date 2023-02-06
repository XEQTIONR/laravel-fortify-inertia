<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\HomeController as Controller;
use Illuminate\Http\Request;
use App\Http\Traits\HierarchicalCategoriesTrait;
use Inertia\Inertia;

class HomeController extends Controller
{
    use HierarchicalCategoriesTrait;

    public function index(Request $request, $slug = null) {

        //return parent::index($request, $slug);

        return Inertia::render( 'Home', [
            'categories' => $this->categoryTree(),
            'products' => parent::index($request, $slug),
        ]);
    }
}
