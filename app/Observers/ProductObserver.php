<?php

namespace App\Observers;

use App\Contracts\SearchClient;
use App\Models\Product;

class ProductObserver
{
    /**
     * Handle the Product "created" event.
     *
     * @param  \App\Models\Product  $product
     * @return void
     */
    public function created(Product $product)
    {
        if ($product->status === 'active') {
            $searchClient = app(SearchClient::class);
            $searchClient->index($product->id, [
                'english_name' => $product->english_name,
                'bangla_name' => $product->bangla_name,
                'uom' => Product::$unitsOfMeasurement[$product->uom],
                'amount' => $product->amount,
                'current_selling_price' => $product->current_selling_price,
                'image' => $product->image,
                'status' => $product->status,

            ]);
        }
    }

    /**
     * Handle the Product "updated" event.
     *
     * @param  \App\Models\Product  $product
     * @return void
     */
    public function updated(Product $product)
    {
        $searchClient = app(SearchClient::class);
        $searchClient->index($product->id, [
            'english_name' => $product->english_name,
            'bangla_name' => $product->bangla_name,
            'uom' => Product::$unitsOfMeasurement[$product->uom],
            'amount' => $product->amount,
            'current_selling_price' => $product->current_selling_price,
            'image' => $product->image,
            'status' => $product->status,
        ]);
    }

    /**
     * Handle the Product "deleted" event.
     *
     * @param  \App\Models\Product  $product
     * @return void
     */
    public function deleted(Product $product)
    {
        $searchClient = app(SearchClient::class);
        $searchClient->delete($product->id);
    }

    /**
     * Handle the Product "restored" event.
     *
     * @param  \App\Models\Product  $product
     * @return void
     */
    public function restored(Product $product)
    {
        //
    }

    /**
     * Handle the Product "force deleted" event.
     *
     * @param  \App\Models\Product  $product
     * @return void
     */
    public function forceDeleted(Product $product)
    {
        //
    }
}
