<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class SupplierListController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @return AnonymousResourceCollection|Response
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

        $date = $request->input('date');
        return ProductResource::collection( Product::with('suppliers')
            ->whereHas('orderItems.order', function(Builder $query) use ($date) {
                $query->where('delivery_date', $date);
            })
            ->get()
        );
    }
}
