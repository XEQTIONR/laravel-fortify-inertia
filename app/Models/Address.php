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
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
