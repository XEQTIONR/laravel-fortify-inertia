<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'english_name' => $this->english_name,
            'bangla_name' => $this->bangla_name,
            'current_selling_price' => $this->current_selling_price/100.0,
            'in_stock' => $this->in_stock,
        ];
    }
}
