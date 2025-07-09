<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    // Table name (optional if matches plural of class name)
    protected $table = 'posts';

    // Mass assignable fields
    protected $fillable = [
        'reviewee_id',
        'description',
        'category',
        'caption',
        'type',
        'planned_post_date',
        'actual_post_date',
        'post_link',
        'source',
        'approval_status',
        'post_status',
        'material_status',
        'remarks',
    ];

    // Dates (optional: allows casting to Carbon)
    protected $dates = [
        'planned_post_date',
        'actual_post_date',
    ];

    // Relationships
    public function reviewee()
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }
}
