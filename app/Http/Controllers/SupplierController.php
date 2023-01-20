<?php

namespace App\Http\Controllers;

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
}
