<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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
        if (! Gate::allows('view-order', $order)) {
            abort(403);
        }

        $receipt = $order->receipts()->current()->first();
        return response()->file(storage_path("app/{$receipt->file}"));
    }
}
