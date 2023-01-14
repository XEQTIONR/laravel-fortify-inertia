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
            'englishName' => $this->english_name,
            'banglaName' => $this->bangla_name,
            'currentSellingPrice' => $this->current_selling_price/100.0,
            'inStock' => $this->in_stock,
        ];
    }
}
