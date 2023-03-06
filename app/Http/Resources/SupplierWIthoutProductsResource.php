<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SupplierWithoutProductsResource extends JsonResource
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
            'id'                     => $this->id,
            'contact_name'           => $this->contact_name,
            'business_name'          => $this->business_name,
            'address'                => $this->address,
            'email'                  => $this->email,
            'primary_contact_number' => $this->primary_contact_number,
            'status'                 => $this->status,
        ];
    }
}
