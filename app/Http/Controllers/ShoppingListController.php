<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Contracts\PDF;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\ShoppingListController as Controller;

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

        $items = parent::__invoke($request);
        if( get_class($items) === Collection::class ) {
            return response()->stream(function() use ($items) {
                $pdf = app(PDF::class);

                $pdf->AddPage();

                $pdf->printShoppingTable($items);

                echo $pdf->Output('S');
            }, 200, [ 'Content-type' => 'application/pdf']);
        }

        return $items;

    }
}
