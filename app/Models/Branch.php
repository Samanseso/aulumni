<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $table = 'branches';
    protected $primaryKey = 'branch_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'address',
        'contact',
    ];

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class, 'branch_id', 'branch_id');
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'branch_id', 'branch_id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'branch_id', 'branch_id');
    }

    public function academicDetails(): HasMany
    {
        return $this->hasMany(AlumniAcademicDetails::class, 'branch_id', 'branch_id');
    }
}
