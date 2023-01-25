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
        'email',
        'primary_contact_number',
        'secondary_contact_number',
        'notes',
        'status',
        'meta'
    ];

    public function products() {
        return $this->belongsToMany( Product::class, 'supplier_products' )->withTimestamps();
    }
}
