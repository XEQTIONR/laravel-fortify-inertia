<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\SupplierProductsController as Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index(Supplier $supplier)
    {
        return Inertia::render( 'Admin/SupplierProducts',
            ['supplier' => parent::index($supplier)] );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Supplier  $supplier
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Supplier $supplier)
    {
        parent::store($request, $supplier);

        return redirect( route('admin.suppliers.index') )->with([
            'message' => "Supplier $supplier->id's products were updated.",
            'status'  => \Illuminate\Http\Response::HTTP_OK,
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
