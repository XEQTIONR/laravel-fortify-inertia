<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\OrderController as Controller;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $orders = parent::index($request);
        $statuses = Order::$statuses;
        return Inertia::render('Admin/Orders', compact('orders', 'statuses'));
    }

    public function updateStatus(Request $request)
    {
        $response = parent::updateStatus($request);

        return redirect( route('admin.orders.index') )->with([
            'title' => 'Statuses updated for orders.',
            'message' => $response['message'],
            'status' => \Illuminate\Http\Response::HTTP_OK,
        ]);
    }
}
