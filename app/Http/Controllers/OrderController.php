<?php

namespace App\Http\Controllers;

use App\Contracts\HierarchicalCategories;
use App\Http\Resources\AddressResource;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\OrderController as Controller;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Show the order receipt.
     *
     * @param Order $order
     * @return Response
     */
    public function show(Order $order)
    {
        return Inertia::render('OrderCreated', [
            'categories' => app(HierarchicalCategories::class),
            'order' => parent::show($order)
        ]);
    }

    /**
     * Show the order creation form.
     *
     * @return Response
     */
    public function create()
    {
        return Inertia::render('CreateOrder', [
            'categories' => app(HierarchicalCategories::class),
            'addresses' => AddressResource::collection(auth()->user()->addresses),
            'paymentConfig' => config('payment'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $order = parent::store($request);

        return redirect( route('orders.show', ['order' => $order ]) )
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
