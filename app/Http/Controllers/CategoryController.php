<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\CategoryController as Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create(Request $request)
    {
        $categories = Category::all();
        return Inertia::render( 'Admin/AddCategory', compact('categories') );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $category = parent::store($request);

        return redirect( route('admin.products.index') )->with([
            'message' => "The category was created. ID: $category->id.",
            'status' => \Illuminate\Http\Response::HTTP_CREATED,
        ]);
    }
}
