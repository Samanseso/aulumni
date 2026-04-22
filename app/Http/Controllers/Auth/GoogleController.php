<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Alumni\CreateAlumni;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as ProviderUser;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Throwable;

class GoogleController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    public function callback(CreateAlumni $createAlumni): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable $exception) {
            report($exception);

            return to_route('login')->withErrors([
                'google' => 'Google authentication failed. Please try again.',
            ]);
        }

        $email = $googleUser->getEmail();

        if (! $email) {
            return to_route('login')->withErrors([
                'google' => 'Google did not provide an email address for this account.',
            ]);
        }

        $isNewUser = false;

        $user = DB::transaction(function () use ($createAlumni, $email, $googleUser, &$isNewUser): User {
            $user = User::query()
                ->where('google_id', $googleUser->getId())
                ->first()
                ?? User::query()->where('email', $email)->first();

            if ($user) {
                return $this->syncGoogleAccount($user, $googleUser);
            }

            $isNewUser = true;

            return $this->createGoogleAlumni($createAlumni, $googleUser, $email);
        });

        Auth::login($user, true);

        if ($isNewUser) {
            return redirect()->route('survey.personal');
        }

        return redirect()->intended(config('fortify.home'));
    }

    private function syncGoogleAccount(User $user, ProviderUser $googleUser): User
    {
        $googleName = trim((string) $googleUser->getName());
        $storedAvatarUrl = $user->avatar;

        $updates = [
            'google_id' => $googleUser->getId(),
        ];

        if (! $user->email_verified_at) {
            $updates['email_verified_at'] = now();
        }

        if ($googleName !== '') {
            $updates['name'] = $googleName;
        }

        if (filled($googleUser->getAvatar()) && $this->shouldSyncGoogleAvatar($user->avatar)) {
            $storedAvatarUrl = $this->storeGoogleAvatar($googleUser->getAvatar(), $user->avatar);
        }

        if (filled($storedAvatarUrl)) {
            $updates['avatar'] = $storedAvatarUrl;
        }

        $user->forceFill($updates)->save();
        $this->syncGoogleProfileDefaults($user, $googleUser);

        return $user;
    }

    private function createGoogleAlumni(CreateAlumni $createAlumni, ProviderUser $googleUser, string $email): User
    {
        $name = $this->resolveDisplayName($googleUser, $email);
        [$firstName, $middleName, $lastName] = $this->splitName($name);

        $alumni = $createAlumni->create([
            'user' => [
                'name' => $name,
                'email' => $email,
                'user_type' => 'alumni',
                'password' => Str::random(32),
                'status' => 'pending',
            ],
            'personal' => array_filter([
                'first_name' => $firstName,
                'middle_name' => $middleName,
                'last_name' => $lastName,
            ], fn (?string $value) => filled($value)),
            'contact' => [
                'email' => $email,
            ],
        ]);

        $user = $alumni->user()->firstOrFail();
        $storedAvatarUrl = $this->storeGoogleAvatar($googleUser->getAvatar());

        $updates = [
            'google_id' => $googleUser->getId(),
            'email_verified_at' => now(),
        ];

        if (filled($storedAvatarUrl)) {
            $updates['avatar'] = $storedAvatarUrl;
        }

        $user->forceFill($updates)->save();

        return $user;
    }

    private function resolveDisplayName(ProviderUser $googleUser, string $email): string
    {
        return trim($googleUser->getName() ?: Str::before($email, '@') ?: 'Google User');
    }

    /**
     * Fill empty alumni personal fields from Google without overwriting survey/profile edits.
     */
    private function syncGoogleProfileDefaults(User $user, ProviderUser $googleUser): void
    {
        if ($user->user_type !== 'alumni') {
            return;
        }

        $alumni = $user->alumni()->with('personal_details')->first();

        if (! $alumni) {
            return;
        }

        [$firstName, $middleName, $lastName] = $this->splitName(
            $this->resolveDisplayName($googleUser, $user->email)
        );

        $personalDetails = $alumni->personal_details;
        $updates = [];

        if (blank($personalDetails?->first_name) && filled($firstName)) {
            $updates['first_name'] = $firstName;
        }

        if (blank($personalDetails?->middle_name) && filled($middleName)) {
            $updates['middle_name'] = $middleName;
        }

        if (blank($personalDetails?->last_name) && filled($lastName)) {
            $updates['last_name'] = $lastName;
        }

        if ($updates === []) {
            return;
        }

        $alumni->personal_details()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($updates, ['alumni_id' => $alumni->alumni_id]),
        );
    }

    /**
     * @return array{0: string|null, 1: string|null, 2: string|null}
     */
    private function splitName(string $name): array
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];

        if (count($parts) <= 1) {
            return [$parts[0] ?? null, null, null];
        }

        if (count($parts) === 2) {
            return [$parts[0], null, $parts[1]];
        }

        return [
            $parts[0],
            implode(' ', array_slice($parts, 1, -1)) ?: null,
            $parts[count($parts) - 1] ?? null,
        ];
    }

    private function shouldSyncGoogleAvatar(?string $currentAvatarUrl): bool
    {
        if (blank($currentAvatarUrl)) {
            return true;
        }

        $host = parse_url($currentAvatarUrl, PHP_URL_HOST);

        return is_string($host)
            && str_contains(Str::lower($host), 'googleusercontent.com');
    }

    private function storeGoogleAvatar(?string $avatarUrl, ?string $previousAvatarUrl = null): ?string
    {
        if (blank($avatarUrl)) {
            return $previousAvatarUrl;
        }

        try {
            $response = Http::accept('image/*')
                ->connectTimeout(10)
                ->retry(2, 200)
                ->timeout(15)
                ->get($avatarUrl);
        } catch (Throwable $exception) {
            report($exception);

            return $previousAvatarUrl;
        }

        $body = $response->body();
        $contentType = Str::lower(Str::before((string) $response->header('Content-Type'), ';'));

        if (! $response->successful() || blank($body)) {
            return $previousAvatarUrl;
        }

        if ($contentType !== '' && ! str_starts_with($contentType, 'image/')) {
            return $previousAvatarUrl;
        }

        $path = 'profile-photos/google/' . date('Y/m') . '/' . Str::uuid() . '.' . $this->resolveAvatarExtension($contentType, $avatarUrl);

        if (! Storage::disk('public')->put($path, $body)) {
            return $previousAvatarUrl;
        }

        $storedAvatarUrl = url('storage/' . $path);

        if ($previousAvatarUrl && $previousAvatarUrl !== $storedAvatarUrl) {
            $this->deleteStoredAvatar($previousAvatarUrl);
        }

        return $storedAvatarUrl;
    }

    private function resolveAvatarExtension(string $contentType, string $avatarUrl): string
    {
        return match ($contentType) {
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            default => $this->resolveAvatarExtensionFromUrl($avatarUrl),
        };
    }

    private function resolveAvatarExtensionFromUrl(string $avatarUrl): string
    {
        $path = parse_url($avatarUrl, PHP_URL_PATH);
        $extension = is_string($path) ? Str::lower(pathinfo($path, PATHINFO_EXTENSION)) : '';

        return match ($extension) {
            'png', 'gif', 'webp' => $extension,
            'jpeg' => 'jpg',
            'jpg' => 'jpg',
            default => 'jpg',
        };
    }

    private function deleteStoredAvatar(?string $avatarUrl): void
    {
        if (! filled($avatarUrl)) {
            return;
        }

        $path = parse_url($avatarUrl, PHP_URL_PATH);

        if (! is_string($path) || ! str_starts_with($path, '/storage/')) {
            return;
        }

        Storage::disk('public')->delete(Str::after($path, '/storage/'));
    }
}
