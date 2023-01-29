<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\CategoryController as Controller;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
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
        $categories = Category::all();
        $grouped =  $categories->groupBy('parent_id');
        $roots = $grouped[''];

        foreach ($roots as $node) {
            $node->children = $this->getChildren($grouped, $node->id);
            $node->level = 0;
        }

        return Inertia::render( 'Admin/AddCategory', ['categories' => $roots ] );
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
     * Arrange the categories in hierarchical order.
     *
     * @param Collection $grouped
     * @param int $id
     * @param int $level
     * @return array
     */
    protected function getChildren(Collection $grouped, int $id, int $level = 0) {
        if (! isset($grouped[$id])) {
            return null;
        }
        foreach ($grouped[$id] as $item) {
            $item->children = $this->getChildren($grouped, $item->id, $level+1);
            $item->level = $level+1;
        }
        return $grouped[$id];
    }
}
