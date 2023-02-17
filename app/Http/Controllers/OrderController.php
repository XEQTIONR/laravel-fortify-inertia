<?php

namespace App\Http\Controllers;

use App\Contracts\HierarchicalCategories;
use App\Http\Resources\AddressResource;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\OrderController as Controller;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create() {
        return Inertia::render('CreateOrder', [
            'categories' => app(HierarchicalCategories::class),
            'addresses' => AddressResource::collection(auth()->user()->addresses),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(Request $request) {
        $order = parent::store($request);

        return redirect( route('welcome') )
                ->with([
                    'title' => "Order created.",
                    'message' => "Order $order->id was created",
                    'status' => \Illuminate\Http\Response::HTTP_CREATED,
                ])
                ->withCookie(Cookie::make(
                    name: 'shopping-cart',
                    value: Str::random(),
                    minutes: 100000,
                    httpOnly: false,
                ));
    }
}
