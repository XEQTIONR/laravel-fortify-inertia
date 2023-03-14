<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'subtotal' => $this->subtotal,
            'total' => $this->total,
            'total_cost' => $this->total_cost,
            'delivery_charge' => $this->delivery_charge,
            'delivery_charge_amount' => $this->delivery_charge_amount,
            'delivery_charge_type' => $this->delivery_charge_type,
            'delivery_date' => $this->delivery_date,
            'time_slot' => Order::$timeSlots[$this->time_slot],
            'status' => $this->status,
            'payments_total' => $this->payments_total,
            'balance' => $this->total - $this->payments_total,
            'customer' => new CustomerResource( $this->whenLoaded('user') ),
            'items' => OrderItemResource::collection( $this->whenLoaded( 'items' ) ),
            'payments' => PaymentResource::collection( $this->whenLoaded( 'payments' ) ),
            'address' => new AddressResource( $this->whenLoaded( 'address' ) ),
            'created_at' => $this->created_at,
        ];
    }
}
