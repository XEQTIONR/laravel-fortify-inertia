<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'english_name',
        'bangla_name',
        'image',
        'status',
        'parent_id',
    ];

    public function subCategories()
    {
        return $this->hasMany( self::class, 'parent_id' );
    }

    public function parent()
    {
        return $this->belongsTo( self::class, 'parent_id' );
    }
}
