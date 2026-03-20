<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $baseUserName = Str::of($input['name'] ?? 'user')
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', '')
            ->value();

        if ($baseUserName === '') {
            $baseUserName = 'user';
        }

        $uniqueUserName = $baseUserName;
        $suffix = 2;

        while (User::where('user_name', $uniqueUserName)->exists()) {
            $uniqueUserName = $baseUserName.$suffix;
            $suffix++;
        }

        return User::create([
            'user_name' => $uniqueUserName,
            'name' => $input['name'],
            'email' => $input['email'],
            'user_type' => $input['user_type'],
            'password' => $input['password'],
            'status' => $input['status'] ?? 'pending',
            'created_by' => $input['created_by'] ?? null,
        ]);
    }
}
