<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ShoppingCartController extends Controller
{
    private $cookieName = 'shopping-cart';

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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return ShoppingCart
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
           'user_id' => 'nullable|numeric',
           'product_id' => 'required|numeric',
        ]);
        $cookie = $request->cookie($this->cookieName);


        $cartItems = ShoppingCart::where('session_cookie', $cookie)->get();
        if ($cartItems->count() > 0) {
            $items = $cartItems->where('product_id', $validated['product_id']);
            if ( $items->count() === 1 ) {
                $item = $items->first();
                Log::info('$items->first()');
                Log::info($item ?? 'is-null');
                $item->qty++;
                $item->status = 'new';
                $item->save();

                return $item;
            }
        }
            $item = new ShoppingCart();
            $item->session_cookie = $cookie;
            $item->user_id = $validated['user_id'];
            $item->product_id = $validated['product_id'];
            $item->qty = 1;
            $item->status = 'new';
            $item->save();

            return $item;
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
