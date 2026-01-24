<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlumniEmploymentDetails extends Model
{
    protected $table = 'alumni_employment_details';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'alumni_id',
        'first_work_position',
        'first_work_time_taken',
        'first_work_acquisition',
        'current_employed',
        'current_work_type',
        'current_work_status',
        'current_work_company',
        'current_work_position',
        'current_work_years',
        'current_work_monthly_income',
        'current_work_satisfaction',
        'au_skills',
        'au_usefulness',
    ];

    public function alumni(): BelongsTo
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }
}
