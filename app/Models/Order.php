<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_type',
        'address_id',
        'status',
        'delivery_date',
        'time_slot'
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
}
