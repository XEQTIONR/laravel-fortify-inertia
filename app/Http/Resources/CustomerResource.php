<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'primary_contact_number' => $this->primary_contact_number,
            'secondary_contact_number' => $this->secondary_contact_number,
            'email_verified' => $this->email_verified_at !== null,
            'sms_verfied' => $this->sms_verfied_at !== null,
            $this->mergeWhen(isset($this->orders_count), function() {
                return [
                    'orders_count' => $this->orders_count,
                    'orders_sum_total' => floatval($this->orders_sum_total)/100.0,
                    'orders_sum_subtotal' => floatval($this->orders_sum_subtotal)/100.0,
                    'orders_sum_delivery_charge' => floatval($this->orders_sum_delivery_charge)/100.0,
                ];
            }),
        ];
    }
}
