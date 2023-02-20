<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'address_id',
        'delivery_charge',
        'delivery_date',
        'payment_type',
        'status',
        'subtotal',
        'time_slot',
        'total',
        'user_id',
    ];

    public static array $timeSlots = [
        '11AM - 1PM',
        '1PM - 4PM',
        '4PM - 7PM',
        '7PM - 10PM',
    ];

    public function items(): HasMany
    {
        return $this->hasMany( OrderItem::class );
    }

    public function shoppingCarts(): HasMany
    {
        return $this->hasMany(ShoppingCart::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo( User::class );
    }

    public function deliveryCharge(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value / 100.0,
            set: fn($value) => intval( bcmul(
                number_format($value, 2,'.', ''),
                '100'
            ) )
        );
    }

    public function subtotal(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value / 100.0,
            set: fn($value) => intval( bcmul(
                number_format($value, 2,'.', ''),
                '100'
            ) )
        );
    }

    public function total(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value / 100.0,
            set: fn($value) => intval( bcmul(
                number_format($value, 2,'.', ''),
                '100'
            ))
        );
    }
}
