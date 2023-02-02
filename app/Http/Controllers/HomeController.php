<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Traits\HierarchicalCategoriesTrait;
use Inertia\Inertia;

class HomeController extends Controller
{
    use HierarchicalCategoriesTrait;

    public function index() {

        return Inertia::render( 'Home', ['categories' => $this->categoryTree()] );
    }
}
