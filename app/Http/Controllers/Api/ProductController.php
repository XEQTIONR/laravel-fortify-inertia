<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProductController extends Controller
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


        $products = Product::orderBy($orderBy, $order)->with('categories')->paginate($perPage);
        $products->appends(compact('perPage', 'orderBy', 'order'));

        return ProductResource::collection($products)->additional([
            'meta' => compact( 'orderBy', 'order' )
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
            'categories' => 'required|array',
            'amount' => 'required|numeric|min:0.01',
            'uom' => [
                'required',
                Rule::in( array_keys(Product::$unitsOfMeasurement))
            ],
            'current_selling_price' => 'required|numeric|min:0.01',
            'image' => 'required|file|mimes:jpg,png',
            'status' => 'required|string|in:active,inactive'
        ])->validate();

        $filename = Storage::putFile('public', $validated['image']);

        $validated['image'] = basename($filename);

        $product = Product::create( $validated );

        $product->categories()->attach($validated['categories']);

        return $product;
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
     * @return Product
     */
    public function update(Request $request, Product $product)
    {
        $validated = Validator::make($request->all(), [
            'english_name' => 'required|string|max:50',
            'bangla_name' => 'required|string|max:50',
            'categories' => 'required|array',
            'uom' => [
                'required',
                Rule::in( array_keys(Product::$unitsOfMeasurement))
            ],
            'current_selling_price' => 'required|numeric|min:0.01',
            // TODO Handle case where remove image button was clicked on FE.
            'image' => 'nullable|file|mimes:jpg,png',
            'status' => 'required|string|in:active,inactive'
        ])->validate();

        if ( $validated['image'] ) {
            $filename = Storage::putFile('public', $validated['image']);
            $validated['image'] = basename($filename);
        } else {
            unset($validated['image']);
        }

        $product->update( $validated );

        $product->categories()->sync($validated['categories']);

        return $product;
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


    // Non standard methods
    /**
     * Update the specified resource's status.
     *
     * @param Request $request
     * @return array
     */
    public function toggleActivation( Request $request ) {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
        ]);

        $active = Product::whereIn('id', $validated['ids'])
            ->where('status', 'active')->get();
        $activeKeys = $active->modelKeys();

        $inactive = Product::whereIn('id', $validated['ids'])
            ->where('status', 'inactive')->get();
        $inactiveKeys = $inactive->modelKeys();


        $countInactive = Product::whereIn('id', $activeKeys)->update(['status' => 'inactive']);
        $countActive = Product::whereIn('id', $inactiveKeys)->update(['status' => 'active']);

        $message = "$countActive activated, $countInactive deactivated.";

        return compact('countActive', 'countInactive', 'message');
    }
}
