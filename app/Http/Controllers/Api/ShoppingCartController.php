<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShoppingCart;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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
     * @param Request $request
     * @return ShoppingCart
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
           'user_id' => 'nullable|numeric',
           'product_id' => 'required|numeric',
        ]);
        $cookie = $request->cookie($this->cookieName);

        $query = ShoppingCart::whereIn('status', ['new', 'updated'])
                    ->where('session_cookie', $cookie);
        if ( $validated['user_id'] > 0 ) {
            $user_id = $validated['user_id'];
            $query = $query->orWhere(function(Builder $query) use ($user_id) {
                $query->whereIn('status', ['new', 'updated'])
                    ->where('user_id', $user_id);
            });
        }
        $cartItems = $query->get();
        if ($cartItems->count() > 0) {
            $items = $cartItems->where('product_id', $validated['product_id']);
            if ( $items->count() > 0 ) {
                $item = $items->first();
                $item->qty++;
                $item->status = 'updated';
                $item->save();
                $item->load('product');
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
            $item->load('product');

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
     * @param Request $request
     * @param  ShoppingCart  $shoppingCart
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, ShoppingCart $cart)
    {
        $validated = $request->validate([
            'qty' => 'numeric|min:0',
        ]);
        $cookie = $request->cookie($this->cookieName);
        $id = $cart->id;
        $action = 'none';
        $user = auth()->user();

        if ( $cart->session_cookie === $cookie || $user && $user->id === $cart->user_id ) {
            if ( $validated['qty'] === 0 ) {
                $this->destroy($request, $cart);
                $action = 'delete';
                $cart = 'null';
            } else {
                $cart->qty = $validated['qty'];
                $cart->status = 'updated';
                $cart->save();
                $action = 'update';
            }
        }

        return response()->json(compact('id', 'action', 'cart'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @param ShoppingCart $cart
     * @return int
     */
    public function destroy(Request $request, ShoppingCart $cart)
    {
        $id = $cart->id;

        $cart->delete();

        return $id;
    }
}
