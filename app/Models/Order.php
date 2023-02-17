<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_type',
        'order_at',
        'address_id',
        'status',
    ];

    public static array $timeSlots = [
        '11AM - 1PM',
        '1PM - 4PM',
        '4PM - 7PM',
        '7PM - 10PM',
    ];

    public function items(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany( OrderItem::class );
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo( User::class );
    }
}
