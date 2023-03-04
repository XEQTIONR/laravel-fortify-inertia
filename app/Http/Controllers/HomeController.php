<?php

namespace App\Http\Controllers;

use App\Contracts\HierarchicalCategories;
use App\Http\Controllers\Api\HomeController as Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request, $slug = null) {

        return Inertia::render( 'Home', [
            'categories' => app(HierarchicalCategories::class),
            'products' => parent::index($request, $slug),
        ]);
    }
}
