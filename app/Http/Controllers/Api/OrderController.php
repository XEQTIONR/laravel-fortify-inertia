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
            'address_id' => 'nullable|integer',
            'delivery_date' => 'required|date',
            'time_slot' => 'required|integer|min:0',
            'items' => 'required|array',
        ]);

        $items = collect($validated['items']);

        $subTotal = $items->reduce( fn($carry, $item) => $carry + ($item['qty'] * $item['product']['current_selling_price']));
        $serviceChargeType = config('payment.service_charge_type');
        $serviceChargeAmount = config('payment.service_charge_amount');

        switch ($serviceChargeType) {
            case 'percentage':
                $total = $subTotal + (($subTotal * $serviceChargeAmount)/100.0);
                break;

            case 'amount':
                $total = $subTotal + $serviceChargeAmount;
                break;
        }

        $order = new Order();
        $order->user_id = auth()->user()->id;
        $order->address_id = $validated['address_id'];
        $order->delivery_date = $validated['delivery_date'];
        $order->time_slot = $validated['time_slot'];
        $order->status = 'created';
        $order->subtotal = $subTotal;
        $order->total = $total;
        $order->save();

        $orderItems = $items->map(function($item) {
            $orderItem = new OrderItem();
            $orderItem->product_id = $item['product_id'];
            $orderItem->qty = $item['qty'];
            $orderItem->price = $item['product']['current_selling_price'];

            return $orderItem;
        });

        $order->items()->saveMany($orderItems);

        $shoppingCartIds = $items->map(function($item) {
            return $item['id'];
        });

        ShoppingCart::whereIn('id', $shoppingCartIds)->update([
            'status' => 'ordered',
            'order_id' => $order->id,
        ]);

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
