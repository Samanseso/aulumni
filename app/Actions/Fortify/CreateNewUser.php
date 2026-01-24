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

        $user_name = Str::lower(Str::remove(" ", $input['name']));
        $user_name_count = User::where('user_name', $user_name)->count();

        
        $unique_user_name = $user_name_count == 0 ? 
        Str::lower(Str::remove(" ", $input['name'])) : 
        Str::lower(Str::remove(" ", $input['name'])) . $user_name_count + 1;


        return User::create([
            'user_name' => $unique_user_name,
            'name' => $input['name'],
            'email' => $input['email'],
            'user_type' => $input['user_type'],
            'password' => $input['password'],
        ]);
    }
}
