<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderItemResource;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class ShoppingListController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|Response
     */
    public function __invoke( Request $request )
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date'
        ]);

        if ( $validator->fails() ) {
            $messageBag = $validator->getMessageBag();

            return response($messageBag->first('date'), 422);
        }
        $delivery_date = $request->input('date');
        $items =  OrderItem::whereHas('order', function(Builder $query) use ($delivery_date) {
            $query->where('delivery_date',$delivery_date )
                ->where('status' , 'created');
        })
            ->with('product')
            ->get()
            ->groupBy('product_id');

        return $items->map( function($item, $key) {
            return OrderItemResource::collection($item);
        });
    }
}
