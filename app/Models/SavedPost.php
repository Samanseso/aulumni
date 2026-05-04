<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedPost extends Model
{
    protected $table = 'saved_posts';
    protected $primaryKey = 'saved_post_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public const UPDATED_AT = null;

    protected $fillable = [
        'post_id',
        'user_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id', 'post_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
