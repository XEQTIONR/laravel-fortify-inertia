<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'english_name',
        'bangla_name',
        'uom',
        'current_selling_price',
        'image',
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
        return $this->belongsToMany( Supplier::class, 'supplier_products' );
    }
}
