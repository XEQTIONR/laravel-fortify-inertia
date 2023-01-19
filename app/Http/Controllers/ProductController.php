<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ProductController as Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $products = parent::index($request);
        $uom = Product::$unitsOfMeasurement;
        return Inertia::render('Admin/Products', compact('products', 'uom'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'english_name' => 'required|string|max:50',
            'bangla_name' => 'required|string|max:50',
            'uom' => [
                'required',
                Rule::in( array_keys(Product::$unitsOfMeasurement))
            ],
            'current_selling_price' => 'required|numeric|min:0.01',
            'image' => 'required|file|mimes:jpg,png',
        ]);

        $filename = Storage::putFile('public', $validated['image']);

        $validated['image'] = basename($filename);
        $validated['current_selling_price'] =   (int) ($validated['current_selling_price'] * 100);
        $product = Product::create( $validated );

        return redirect( route('admin.products.index') )->with([
            'message' => "The product was created. ID: $product->id.",
            'status' => \Illuminate\Http\Response::HTTP_CREATED,
        ]);
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
