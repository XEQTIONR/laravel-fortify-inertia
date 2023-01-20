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
}
