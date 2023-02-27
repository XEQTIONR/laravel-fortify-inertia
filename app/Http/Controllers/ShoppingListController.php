<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Services\PDF;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;

class ShoppingListController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|Response
     */
    public function __invoke( Request $request )
    {

        $validator = Validator::make($request->all(), [
            'date' => 'required|date'
        ]);

        if ( $validator->fails() ) {
            $messageBag = $validator->getMessageBag('date');

            return response($messageBag->first('date'), 422);

        }
        $delivery_date = $request->input('date');
        $items = OrderItem::whereHas('order', function(Builder $query) use ($delivery_date) {
                    $query->where('delivery_date',$delivery_date )
                        ->where('status' , 'created');
                })
                ->with('product')
                ->get()
                ->groupBy('product_id');

        return response()->stream(function() use ($items) {
            $pdf = app(PDF::class);

            $pdf->AddPage();

            $pdf->printShoppingTable($items);

            echo $pdf->Output('S');
        }, 200, [ 'Content-type' => 'application/pdf']);

    }
}
