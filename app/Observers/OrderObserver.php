<?php

namespace App\Observers;

use App\Contracts\SMSClient;
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
        $smsClient = app()->make(SMSClient::class);

        $status = [
            'original' => $order->getOriginal('status'),
            'new' => $order->status,
        ];

        switch ($status['original']) {
            case 'created':
                if ( $status['new'] === 'prepared' ) {
                    // prepared message
                    $smsClient->send(
                        "Your order $order->id has been prepared we will delivery it soon.",
                        $order->user->primary_contact_number,
                    );
                } else if ( $status['new'] === 'cancelled' ) {
                    // cancel message
                    $smsClient->send(
                        "Your order $order->id was cancelled. Contact us for more information.",
                        $order->user->primary_contact_number,
                    );
                }
            break;

            case 'prepared':
                if ( $status['new'] === 'delivered' ) {
                    //deliver message
                    $smsClient->send(
                        "Your order $order->id was delivered. Enjoy.",
                        $order->user->primary_contact_number,
                    );
                }
            break;
        }
    }
}
