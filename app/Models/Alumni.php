<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Alumni extends Model
{
    protected $table = 'alumni';
    protected $primaryKey = 'alumni_id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = true;

    protected $fillable = [
        'alumni_id',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function personal_details(): HasOne
    {
        return $this->hasOne(AlumniPersonalDetails::class, 'alumni_id', 'alumni_id');
    }

    public function academic_details(): HasOne
    {
        return $this->hasOne(AlumniAcademicDetails::class, 'alumni_id', 'alumni_id');
    }

    public function contact_details(): HasOne
    {
        return $this->hasOne(AlumniContactDetails::class, 'alumni_id', 'alumni_id');
    }

    public function employment_details(): HasOne
    {
        return $this->hasOne(AlumniEmploymentDetails::class, 'alumni_id', 'alumni_id');
    }
}
