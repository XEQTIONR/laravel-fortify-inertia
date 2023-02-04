<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'english_name',
        'bangla_name',
        'slug',
        'image',
        'status',
        'parent_id',
    ];

    /**
     * All its immediate sub / child categories.
     *
     * @return HasMany
     */
    public function subCategories(): HasMany {
        return $this->hasMany( self::class, 'parent_id' );
    }

    /**
     * Its parent category.
     *
     * @return BelongsTo
     */
    public function parent(): BelongsTo {
        return $this->belongsTo( self::class, 'parent_id' );
    }

    /**
     * A Category may have many products.
     *
     * @return BelongsToMany
     */
    public function products(): BelongsToMany {
        return $this->belongsToMany( Product::class, 'product_categories' )->withTimestamps();
    }
}
