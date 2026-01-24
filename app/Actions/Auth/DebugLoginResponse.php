<?php

namespace App\Actions\Auth;

use Laravel\Fortify\Contracts\LoginResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class DebugLoginResponse implements LoginResponse
{
    public function toResponse($request)
    {
        $user = Auth::user();

        return response()->json([
            'authenticated' => (bool) $user,
            'user_id' => $user ? $user->getAuthIdentifier() : null,
            'user_primary_key_name' => $user ? $user->getAuthIdentifierName() : null,
            'user_class' => $user ? get_class($user) : null,
            'user_attributes' => $user ? $user: null,
            'session_id' => session()->getId(),
            'session_payload' => array_keys(session()->all()),
            'cookies' => array_keys($request->cookies->all()),
            'request_credentials' => [
                'username' => $request->input(config('fortify.username', 'email')),
                'remember' => $request->boolean('remember'),
            ],
        ]);
    }
}
