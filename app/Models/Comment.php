<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use SoftDeletes;

    protected $table = 'comments';
    protected $primaryKey = 'comment_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'post_id',
        'user_id',
        'parent_comment_id',
        'content',
        'is_edited',
    ];

    protected $casts = [
        'is_edited'   => 'boolean',
        'reply_count' => 'integer',
        'created_at'  => 'datetime:m-d-Y H:i:s', 
        'updated_at'  => 'datetime:m-d-Y H:i:s',
        'deleted_at'  => 'datetime:m-d-Y H:i:s',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id', 'post_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_comment_id', 'comment_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_comment_id', 'comment_id')->orderBy('created_at', 'asc');
    }

    protected static function boot()
    {
        parent::boot();

        // increment parent's reply_count when creating a reply
        static::created(function (Comment $comment) {
            if ($comment->parent_comment_id) {
                Comment::where('comment_id', $comment->parent_comment_id)->increment('reply_count');
            }
        });

        // decrement parent's reply_count when deleting a reply (soft or hard)
        static::deleted(function (Comment $comment) {
            if ($comment->parent_comment_id) {
                Comment::where('comment_id', $comment->parent_comment_id)->decrement('reply_count');
            }
        });

        // mark edited flag when updating content
        static::updating(function (Comment $comment) {
            if ($comment->isDirty('content')) {
                $comment->is_edited = true;
            }
        });
    }
}
