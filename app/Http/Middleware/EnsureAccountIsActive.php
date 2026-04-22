<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null) {
            return $next($request);
        }

        if ($request->routeIs('account.pending', 'account.inactive', 'logout', 'verification.*')) {
            return $next($request);
        }

        if ($user->status === 'pending') {
            if ($request->routeIs('survey.*')) {
                return $next($request);
            }

            return redirect()->route('account.pending');
        }

        if ($user->status === 'inactive') {
            return redirect()->route('account.inactive');
        }

        return $next($request);
    }
}
