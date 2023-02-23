<?php

namespace App\Http\Controllers;

use App\Contracts\HierarchicalCategories;
use App\Http\Resources\AddressResource;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\OrderController as Controller;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
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
}
