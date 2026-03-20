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
        'branch_id',
        'department_id',
        'course_id',
        'branch',
        'course',
    ];

    public function alumni(): BelongsTo
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }

    public function branchRelation(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id', 'branch_id');
    }

    public function departmentRelation(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id', 'department_id');
    }

    public function courseRelation(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
}
