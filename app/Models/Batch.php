<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Batch extends Model
{
    protected $table = 'batch';
    protected $primaryKey = 'year';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = true;

    protected $fillable = [
        'year',
        'name',
    ];

    public function academicDetails(): HasMany
    {
        return $this->hasMany(AlumniAcademicDetails::class, 'batch', 'year');
    }
}
