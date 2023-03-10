<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'amount',
        'payment_type',
        'file',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo( Order::class );
    }

    public function amount(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value / 100.0,
            set: fn($value) => intval( bcmul(
                number_format($value, 2,'.', ''),
                '100'
            ) )
        );
    }
}
