<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Http\Traits\HierarchicalCategoriesTrait;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ProductController as Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use HierarchicalCategoriesTrait;
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
     * @return Response
     */
    public function create(Request $request)
    {
        return Inertia::render('Admin/AddProduct', [
            'uom' => Product::$unitsOfMeasurement,
            'categories' => $this->categoryTree(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $product = parent::store($request);

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
     * @return Response
     */
    public function edit( Product $product )
    {
        return Inertia::render( 'Admin/EditProduct', [
            'product' => new ProductResource($product->load('categories')),
            'uom' => Product::$unitsOfMeasurement,
            'categories' => $this->categoryTree(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  Product $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Product $product)
    {
        parent::update($request, $product);
        return redirect( route('admin.products.index') )->with([
            'message' => "Product $product->id was updated.",
            'status' => \Illuminate\Http\Response::HTTP_OK,
        ]);
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
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleActivation( Request $request ) {

        $response = parent::toggleActivation( $request );

        return redirect( route('admin.products.index') )->with([
            'title' => 'Statuses updated.',
            'message' => $response['message'],
            'status' => \Illuminate\Http\Response::HTTP_OK,
        ]);
    }
}
