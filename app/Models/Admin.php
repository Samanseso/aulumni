<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    protected $table = 'admin';
    protected $primaryKey = 'employee_id';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'employee_id',
        'user_id',
        'employee_number',
        'first_name',
        'middle_name',
        'last_name',
        'contact',
        'branch',
        'department',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
