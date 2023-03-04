<?php

namespace App\Http\Controllers;

use App\Contracts\HierarchicalCategories;
use App\Http\Resources\AddressResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function __invoke(Request $request)
    {
        $addresses = auth()->user()->addresses;
        return Inertia::render('MyProfile', [
            'addresses' => AddressResource::collection( auth()->user()->addresses ),
            'categories' => app(HierarchicalCategories::class)
        ]);
    }
}
