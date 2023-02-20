<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'status',
        'qty',
        'price'
    ];

    public function order():BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get/Set the current_selling_price.
     *
     * @return Attribute
     */
    public function price(): Attribute {
        return Attribute::make(
            get: fn($value) => $value / 100.0,
            set: fn($value) => intval( bcmul(
                number_format($value, 2,'.', ''),
                '100'
            ) )
        );
    }
}
