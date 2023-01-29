<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $perPage = $request->perPage ?? 10;
        $orderBy = $request->orderBy ?? 'id';
        $order = $request->order ?? 'asc';

        $categories = Category::orderBy($orderBy, $order)->paginate($perPage);
        $categories->appends(compact('perPage', 'orderBy', 'order'));

        return CategoryResource::collection($categories)->additional([
            'meta' => compact( 'orderBy', 'perPage', 'order' )
        ]);


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'english_name' => 'required|string|max:50',
            'bangla_name' => 'required|string|max:50',
            'parent_id' => 'nullable',
            'image' => 'required|file|mimes:jpg,png',
            'status' => 'required|string|in:active,inactive'
        ])->validate();

        $filename = Storage::putFile('public', $validated['image']);

        $validated['image'] = basename($filename);

        return Category::create($validated);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Category $category
     * @return Category
     */
    public function update(Request $request, Category $category)
    {
        $validated = Validator::make($request->all(), [
            'english_name' => 'required|string|max:50',
            'bangla_name' => 'required|string|max:50',
            'parent_id' => 'nullable',
            'image' => 'nullable|file|mimes:jpg,png',
            'status' => 'required|string|in:active,inactive'
        ])->validate();

        if ( $validated['image'] ) {
            $filename = Storage::putFile('public', $validated['image']);
            $validated['image'] = basename($filename);
        } else {
            unset($validated['image']);
        }

        $category->update($validated);

        return $category;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
