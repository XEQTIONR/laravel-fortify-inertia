<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Resources\OrderResource;
use Illuminate\Validation\Rule;

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

        $query = Order::orderBy($orderBy, $order);

        $filters = $request->filters;

        if ($filters !== null) {
            if (isset($filters['statuses'])) {
                $query->whereIn('status', $filters['statuses']);
            }

            if (isset($filters['delivery_date'])) {
                $query->where('delivery_date', $filters['delivery_date']);
            }
        }

        $orders = $query->paginate($perPage);
        $orders->appends(compact('perPage', 'orderBy', 'order'));

        return OrderResource::collection($orders)->additional([
            'meta' => compact('orderBy', 'order', 'filters')
        ]);
    }

    public function updateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'status' => [ 'required', Rule::in(Order::$statuses) ]
        ]);

        Order::whereIn('id', $validated['ids'])
            ->update([ 'status' => $validated['status']]);

        return [
            'message' => 'Status updated to `'
            . ucfirst($validated['status'])
            . '` for orders '. implode(', ', $validated['ids'])
        ];
    }
}
