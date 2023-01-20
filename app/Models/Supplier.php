<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'contact_name',
        'business_name',
        'address',
        'email_address',
        'cell_phone',
        'business_phone_number',
        'notes',
        'status',
        'meta'
    ];
}
