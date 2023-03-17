<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CostController extends Controller
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
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create(Order $order)
    {
        $order->load('items.product');
        return Inertia::render('Admin/RecordCost', [
            'order' => new OrderResource( $order )
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Order $order)
    {
        $count = $order->items()->count();
        $validated = $request->validate([
           'items' => [ 'required', 'array', 'min:' . $count, 'max:' . $count ]
        ]);

        $orderTotalDefined = true;
        $total = 0;
        foreach ( $validated['items'] as $item ) {
            $orderItem = OrderItem::find($item['id']);
            $cost = floatval($item['cost']);

            if ($item['cost'] === null) {
                $orderTotalDefined = false;
            }

            if ( $cost > 0 ) {
                $orderItem->cost = $cost;
                $total += $cost;
            } else {
                $orderItem->cost = null;
                $orderTotalDefined = false;
            }
            $orderItem->save();
        }

        $order->total_cost =  ($orderTotalDefined ? $total : null);
        $order->save();

        $message = ($orderTotalDefined ? '' : 'partially ') . 'updated cost for order.';

        return redirect( route('admin.orders.index') )->with([
            'title' => "Updated cost for order# {$order->id}",
            'message' => ucfirst($message),
            'status' => \Illuminate\Http\Response::HTTP_OK,
        ]);
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
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
