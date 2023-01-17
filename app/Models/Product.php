<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public static $unitsOfMeasurement = [
        'pc'     => 'pieces',
        'dozen'  => 'dozens',
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
}
