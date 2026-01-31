<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!$request->user() || $request->user()->user_type !== $role) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}

