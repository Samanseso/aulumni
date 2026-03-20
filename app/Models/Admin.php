<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class Admin extends User
{
    protected static function booted(): void
    {
        static::addGlobalScope('admins_only', function (Builder $builder) {
            $builder->where('user_type', 'admin');
        });
    }
}
