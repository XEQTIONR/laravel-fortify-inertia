<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Supplier
     */
    public function index(Supplier $supplier)
    {
        $supplier->load('products');
        return $supplier;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Supplier  $supplier
     * @return array
     */
    public function store(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
           'products' => 'required|array'
        ]);
        $ids = collect($validated['products'])->map( fn($item) => $item['id'] );

        return $supplier->products()->sync($ids);
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
