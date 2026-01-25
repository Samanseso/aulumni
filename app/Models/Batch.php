<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    protected $table = 'batch';
    protected $primaryKey = 'year';
    public $timestamps = true;

    protected $fillable = [
        'year',
        'name',
    ];
}
