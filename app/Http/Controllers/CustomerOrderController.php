<?php

namespace App\Http\Controllers;

use App\Contracts\HierarchicalCategories;
use App\Http\Resources\AddressResource;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Http\Controllers\Api\CustomerOrderController as Controller;
use Inertia\Response;

class CustomerOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return Inertia::render('MyOrders', [
            'orders' => parent::index(),
            'categories' => app(HierarchicalCategories::class),
        ]);
    }

    /**
     * Show the form for creating a new resource.
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
     * @param Request $request
     * @return RedirectResponse
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

    /**
     * Display the specified resource.
     *
     * @param  Order  $order
     * @return Response
     */
    public function show(Order $order)
    {
        return Inertia::render('OrderCreated', [
            'categories' => app(HierarchicalCategories::class),
            'order' => parent::show($order)
        ]);
    }
}
