<?php

namespace App\Http\Controllers;

use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use App\Http\Controllers\Api\SupplierController as Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class SupplierController extends Controller
{
    //
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $suppliers = parent::index($request);

        return Inertia::render('Admin/Suppliers', compact('suppliers'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create(Request $request)
    {
        return Inertia::render('Admin/AddSupplier');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {

        $supplier = parent::store($request);

        return redirect( route('admin.suppliers.index') )->with([
            'message' => "The supplier was created. ID: $supplier->id.",
            'status' => \Illuminate\Http\Response::HTTP_CREATED,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Supplier $supplier
     * @return Response
     */
    public function edit( Supplier $supplier )
    {
        return Inertia::render('Admin/EditSupplier', ['supplier' => new SupplierResource($supplier)]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  Supplier  $supplier
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Supplier $supplier)
    {
        //
        parent::update($request, $supplier);
        return redirect( route('admin.suppliers.index') )->with([
            'message' => "Supplier $supplier->id was updated.",
            'status' => \Illuminate\Http\Response::HTTP_OK,
        ]);
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

        return redirect( route('admin.suppliers.index') )->with([
            'title' => 'Statuses updated.',
            'message' => $response['message'],
            'status' => \Illuminate\Http\Response::HTTP_OK,
        ]);
    }
}
