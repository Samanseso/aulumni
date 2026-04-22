<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Alumni;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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
            'name' => ['nullable', 'string', 'max:255'],
            'email' => $this->emailRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return DB::transaction(function () use ($input): User {
            $userType = $input['user_type'] ?? 'alumni';
            $displayName = $this->resolveDisplayName($input);

            $user = User::create([
                'user_name' => $this->uniqueUserName($this->userNameSeed($input, $displayName)),
                'name' => $displayName,
                'email' => $input['email'],
                'user_type' => $userType,
                'show_survey_onboarding' => $userType === 'alumni',
                'password' => $input['password'],
                'status' => $input['status'] ?? 'pending',
                'created_by' => $input['created_by'] ?? null,
            ]);

            if ($userType === 'alumni' && filter_var($input['bootstrap_alumni_profile'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
                $this->bootstrapAlumniProfile($user);
            }

            return $user;
        });
    }

    private function uniqueUserName(string $name): string
    {
        $baseUserName = Str::of($name)
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

        return $uniqueUserName;
    }

    private function bootstrapAlumniProfile(User $user): void
    {
        if (Alumni::query()->where('user_id', $user->user_id)->exists()) {
            return;
        }

        Alumni::query()->create([
            'alumni_id' => $this->nextAlumniId(),
            'user_id' => $user->user_id,
        ]);
    }

    private function nextAlumniId(): string
    {
        $prefix = date('y').'-';

        $max = Alumni::query()
            ->where('alumni_id', 'like', $prefix.'%')
            ->selectRaw('MAX(CAST(SUBSTRING(alumni_id, 4) AS UNSIGNED)) as max_seq')
            ->value('max_seq') ?? 0;

        return $prefix.sprintf('%05d', $max + 1);
    }

    private function resolveDisplayName(array $input): string
    {
        $name = trim((string) ($input['name'] ?? ''));

        if ($name !== '') {
            return $name;
        }

        $emailLocalPart = Str::before((string) ($input['email'] ?? ''), '@');
        $fallbackName = Str::of($emailLocalPart)
            ->replaceMatches('/[^A-Za-z0-9]+/', ' ')
            ->squish()
            ->headline()
            ->value();

        return $fallbackName !== '' ? $fallbackName : 'New User';
    }

    private function userNameSeed(array $input, string $displayName): string
    {
        $emailLocalPart = Str::before((string) ($input['email'] ?? ''), '@');

        return $emailLocalPart !== '' ? $emailLocalPart : $displayName;
    }
}
