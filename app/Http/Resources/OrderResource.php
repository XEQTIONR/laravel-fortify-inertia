<?php

namespace App\Http\Resources;

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
            'time_slot' => $this->time_slot,
            'status' => $this->status,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),

        ];
    }
}
