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
            'delivery_charge' => $this->delivery_charge,
            'delivery_date' => $this->delivery_date,
            'time_slot' => Order::$timeSlots[$this->time_slot],
            'status' => $this->status,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'address' => new AddressResource($this->whenLoaded('address')),
            'created_at' => $this->created_at,

        ];
    }
}
