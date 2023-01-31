<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\CategoryController as Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Traits\HierarchicalCategoriesTrait;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class CategoryController extends Controller
{
    use HierarchicalCategoriesTrait;
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $categories = parent::index($request);
        return Inertia::render('Admin/Categories', compact('categories'));
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return Inertia::render( 'Admin/AddCategory', ['categories' => $this->categoryTree() ] );
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
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit( Category $category )
    {
        $category->load('parent');
        $resource = new CategoryResource( $category );
        return Inertia::render( 'Admin/EditCategory', [
            'category' => $resource,
            'categories' => $this->categoryTree(),
        ] );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Category $category
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Category $category)
    {
        parent::update($request, $category);
        return redirect( route('admin.categories.index') )->with([
            'message' => "Product $category->id was updated.",
            'status' => \Illuminate\Http\Response::HTTP_OK,
        ]);
    }
}
