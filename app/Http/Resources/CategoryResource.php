<?php

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'parent' => new self($this->parent),
            'image' => $this->image,
            'status' => $this->status,
        ];
    }
}
