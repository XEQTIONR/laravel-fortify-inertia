<?php

namespace App\Http\Controllers;

use App\Contracts\HierarchicalCategories;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Api\AddressController as Controller;
use Inertia\Response;

class AddressController extends Controller
{
    public function index()
    {
        return Inertia::render('MyAddresses', [
           'addresses' => parent::index(),
           'categories' => app(HierarchicalCategories::class)
        ]);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return Inertia::render('NewAddress', [
            'categories' => app(HierarchicalCategories::class)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request)
    {
        parent::store($request);

        return redirect('profile');
    }
}
