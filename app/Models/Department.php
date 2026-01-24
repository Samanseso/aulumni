<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $table = 'departments';
    protected $primaryKey = 'department_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
    ];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'department_id', 'department_id');
    }
}
