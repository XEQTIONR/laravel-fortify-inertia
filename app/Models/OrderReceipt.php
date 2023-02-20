<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderReceipt extends Model
{
    use HasFactory;

    protected $fillable = [
      'order_id',
      'version',
      'current',
      'file'
    ];

    protected $casts = [
        'current' => 'boolean'
    ];

    public function scopeCurrent(Builder $query)
    {
        $query->where('current', true);
    }
}
