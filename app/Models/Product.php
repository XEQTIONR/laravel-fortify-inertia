<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'english_name',
        'bangla_name',
        'uom',
        'amount',
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
        'mg'     => 'mg',
        'gm'     => 'grams',
        'oz'     => 'ounces',
        'kg'     => 'kg',
        'ltr'    => 'litres',
        'ml'     => 'ml',
    ];

    /**
     * A Product may have many suppliers.
     *
     * @return BelongsToMany
     */
    public function suppliers(): BelongsToMany {
        return $this->belongsToMany( Supplier::class, 'supplier_products' )->withTimestamps();
    }

    /**
     * A Product may have many category terms.
     *
     * @return BelongsToMany
     */
    public function categories(): BelongsToMany {
        return $this->belongsToMany( Category::class, 'product_categories' )->withTimestamps();
    }
    /**
     * Get the image.
     *
     * @return Attribute
     */
    public function image(): Attribute {
        return Attribute::make(
            get: fn ($value) =>  str_starts_with($value, 'http') ? $value : Storage::url($value)
        );
    }

    /**
     * Get/Set the current_selling_price.
     *
     * @return Attribute
     */
    public function currentSellingPrice(): Attribute {
        return Attribute::make(
            get: fn($value) => $value / 100.0,
            set: fn($value) => (int) ($value * 100)
        );
    }
}
