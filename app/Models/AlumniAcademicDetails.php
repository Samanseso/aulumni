<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlumniAcademicDetails extends Model
{
    protected $table = 'alumni_academic_details';
    protected $primaryKey = 'alumni_id';
    protected $keyType = 'string';
    public $timestamps = true;

    protected $fillable = [
        'alumni_id',
        'student_number',
        'school_level',
        'batch',
        'branch',
        'course',
    ];

    public function alumni(): BelongsTo
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }
}
