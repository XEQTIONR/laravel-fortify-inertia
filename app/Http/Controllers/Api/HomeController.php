<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request, $slug = null)
    {
        $perPage = 10;
        $category = null;
        $products = [];

        if ( $slug !== null ) {
            $categories = Category::all();
            $category = $categories->where('slug', $slug)->first();
            if ( $category ) {
                $queue = [ $category ];
                $grouped =  $categories->groupBy('parent_id');

                $i = 0;
                while( $i < count($queue) ) {
                    if ( isset($grouped[$queue[$i]->id]) ) {
                        array_push($queue, ...$grouped[$queue[$i]->id]);
                    }
                    $i++;
                }

                $ids = array_map(fn($item) => $item->id, $queue);

                $products = Product::whereHas('categories', function(Builder $query) use ($ids) {
                    $query->whereIn('categories.id', $ids );
                })->paginate($perPage);
            }
        }


        return ProductResource::collection($products)->additional([
            'meta' => [
                'category' => $category ? new CategoryResource($category) : null
            ]
        ]);
//        return [
//            'category' => $category ? new CategoryResource($category) : null,
//            'products' => ProductResource::collection($products)
//        ];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
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
