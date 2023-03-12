<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;

class OrderPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $perPage = $request->perPage ?? 10;
        $orderBy = $request->orderBy ?? 'id';
        $order = $request->order ?? 'asc';

        $query = Payment::orderBy($orderBy, $order);

        $payments = $query->paginate($perPage);
        $payments->appends(compact('perPage', 'orderBy', 'order'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Payment
     */
    public function store(Request $request, Order $order)
    {
        $validated = $request->validate([
            'payment' => 'numeric|min:0'
        ]);

        $payment = new Payment();
        $payment->amount = $validated['payment'];

        $order->payments()->save($payment);

        $payments = $order->payments()->get();

        $paymentsTotal = $payments->reduce( fn($carry, $item) => $carry + $item->amount, 0);
        $order->payments_total = $paymentsTotal;
        $order->save();

        return $payment;
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
