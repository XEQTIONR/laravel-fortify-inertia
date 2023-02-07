<?php

namespace App\Http\Resources;

use App\Models\Product;
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
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'uom' => Product::$unitsOfMeasurement[$this->uom],
            'amount' => $this->amount,
            'current_selling_price' => $this->current_selling_price,
            'in_stock' => $this->in_stock,
            'image' => $this->image,
            'status' => $this->status,
        ];
    }
}
