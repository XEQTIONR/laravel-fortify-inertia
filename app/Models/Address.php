<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'business_name',
        'address',
        'phone_number',
        'delivery_date',
        'time_slot',
    ];

    public static $timeSlots = [
        '11AM - 1PM',
        '1PM - 4PM',
        '4PM - 7PM',
        '7PM - 10PM',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
