<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlumniPersonalDetails extends Model
{
    protected $table = 'alumni_personal_details';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'alumni_id',
        'first_name',
        'middle_name',
        'last_name',
        'photo',
        'gender',
        'birthday',
        'bio',
        'interest',
        'address',
    ];

    public function alumni(): BelongsTo
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }
}
