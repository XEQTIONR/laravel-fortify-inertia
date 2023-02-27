<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeliveryListController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date'
        ]);

        if ( $validator->fails() ) {
            $messageBag = $validator->getMessageBag();

            return response($messageBag->first('date'), 422);
        }
        $delivery_date = $request->input('date');
        return OrderResource::collection(Order::with('items.product')
            ->where('delivery_date',$delivery_date )
            ->where('status' , 'created')
            ->orderBy('time_slot')
            ->get());
    }
}
