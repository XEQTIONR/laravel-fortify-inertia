<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\OrderReceiptController as Controller;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class OrderReceiptController extends Controller
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
     * Display the specified resource.
     *
     * @param  Order  $order
     * @return BinaryFileResponse
     */
    public function show(Order $order)
    {
        return parent::show($order);
    }
}
