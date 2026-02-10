<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $table = 'posts';
    protected $primaryKey = 'post_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'post_uuid',
        'user_id',
        'content',
        'place',
        'privacy',
        'comments_count',
        'reactions_count',
        'status',
    ];

    protected $casts = [
        'comments_count'   => 'integer',
        'reactions_count'  => 'integer',
        'created_at'       => 'datetime:m-d-Y H:i:s', 
        'updated_at'       => 'datetime:m-d-Y H:i:s',
    ];


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->post_uuid)) {
                $model->post_uuid = (string) Str::uuid();
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'post_id', 'post_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'post_id', 'post_id');
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class, 'post_id', 'post_id');
    }

    public function shares(): HasMany
    {
        return $this->hasMany(Share::class, 'post_id', 'post_id');
    }
}
