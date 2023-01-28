<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'english_name',
        'bangla_name',
        'uom',
        'current_selling_price',
        'image',
        'status',
    ];

    public static $unitsOfMeasurement = [
        'pc'     => 'pieces',
        'dz'     => 'dozens',
        'pk'     => 'packs',
        'box'    => 'boxes',
        'bottle' => 'bottles',
        'mg'     => 'milligrams',
        'gm'     => 'grams',
        'oz'     => 'ounces',
        'kg'     => 'kilograms',
        'ltr'    => 'litres',
        'ml'     => 'millilitres',
    ];

    public function suppliers() {
        return $this->belongsToMany( Supplier::class, 'supplier_products' )->withTimestamps();
    }

    /**
     * Get the product image.
     *
     * @return Attribute
     */
    public function image(): Attribute {
        return Attribute::make(
            get: fn ($value) =>  str_starts_with($value, 'http') ? $value : Storage::url($value)
        );
    }
}
