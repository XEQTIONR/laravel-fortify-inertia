<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Api\OrderPaymentController as Controller;

class OrderPaymentController extends Controller
{
    /**
     * Show the creation.
     *
     * @return Response
     */
    public function create(Request $request, Order $order)
    {
        return Inertia::render('Admin/AddPayment', [
            'order' => new OrderResource($order)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Order $order)
    {
        $payment = parent::store($request, $order);

        return redirect( route('admin.orders.index') )->with([
            'message' => "Payment of ৳{$payment->amount} recorded for order {$order->id}",
            'status' => \Illuminate\Http\Response::HTTP_CREATED,
        ]);
    }
}
