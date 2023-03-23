<?php

namespace App\Observers;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     *
     * @param  Order  $order
     * @return void
     */
    public function created(Order $order)
    {

    }

    /**
     * Handle the Order "updated" event.
     *
     * @param  Order $order
     * @return void
     */
    public function updated(Order $order)
    {
        Log::info($order->getOriginal('status'));
        Log::info('updated');
        Log::info($order);
    }
}
