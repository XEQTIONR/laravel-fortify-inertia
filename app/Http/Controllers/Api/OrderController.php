<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Order
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id|integer',
            'payment_type' => 'nullable|string',
            'address_id' => 'nullable|integer',
            'status' => 'required|string',
            'items' => 'required|array',
        ]);
        //Log::info($validated['items']);
        $ids = array_map(fn($item) => $item['id'], $validated['items']);
        $cartItems = ShoppingCart::whereIn('id', $ids)
                        ->with('product')
                        ->get();

        $orderItems = $cartItems->map(function($item) {
            $orderItem = new OrderItem();
            $orderItem->product_id = $item['product_id'];
            $orderItem->selling_price = $item['product']['current_selling_price'] * 100;

            return $orderItem;
        });
        Log::info($orderItems);

        $order = new Order();
        $order->user_id = $validated['user_id'];
        $order->payment_type = $validated['payment_type'];
        $order->address_id = $validated['address_id'];
        $order->status = $validated['status'];
        $order->save();

        $order->items()->saveMany($orderItems);

        return $order;
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
