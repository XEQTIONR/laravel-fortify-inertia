<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\OrderController as Controller;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function store(Request $request) {
        $order = parent::store($request);

        return redirect( route('welcome') )
                ->with([
                    'title' => "Order $order->id created.",
                    'message' => "Order was created",
                    'status' => \Illuminate\Http\Response::HTTP_CREATED,
                ])
                ->withCookie(Cookie::make(
                    name: 'shopping-cart',
                    value: Str::random(),
                    minutes: 100000,
                    httpOnly: false,
                ));
    }
}
