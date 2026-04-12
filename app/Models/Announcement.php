<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Announcement extends Model
{
    protected $table = 'announcements';
    protected $primaryKey = 'announcement_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'announcement_uuid',
        'user_id',
        'title',
        'event_type',
        'organizer',
        'venue',
        'starts_at',
        'ends_at',
        'description',
        'registration_link',
        'privacy',
        'status',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->announcement_uuid)) {
                $model->announcement_uuid = (string) Str::uuid();
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(AnnouncementAttachment::class, 'announcement_id', 'announcement_id');
    }
}
