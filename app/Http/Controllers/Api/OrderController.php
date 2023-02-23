<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateOrderReceipt;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use App\Http\Resources\OrderResource;
use Illuminate\Support\Facades\Gate;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $ids = $request->ids ?? false;

        if ( $ids ) {
            $orders = Order::whereIn('id', $ids)->get();
            return OrderResource::collection($orders);
        }

        $perPage = $request->perPage ?? 10;
        $orderBy = $request->orderBy ?? 'id';
        $order = $request->order ?? 'asc';

        $orders = Order::orderBy($orderBy, $order)->paginate($perPage);
        $orders->appends(compact('perPage', 'orderBy', 'order'));

        return OrderResource::collection($orders)->additional([
            'meta' => compact('orderBy', 'order')
        ]);
    }
}
