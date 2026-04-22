<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Contracts\User as ProviderUser;
use Laravel\Socialite\Facades\Socialite;
use Mockery;
use Tests\TestCase;

class GoogleAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_redirect_route_sends_users_to_google(): void
    {
        $provider = Mockery::mock(Provider::class);
        $provider->shouldReceive('scopes')
            ->once()
            ->with(['openid', 'profile', 'email'])
            ->andReturnSelf();
        $provider->shouldReceive('redirect')
            ->once()
            ->andReturn(redirect('https://accounts.google.com/o/oauth2/auth'));

        Socialite::shouldReceive('driver')
            ->once()
            ->with('google')
            ->andReturn($provider);

        $response = $this->get(route('google.redirect'));

        $response->assertRedirect('https://accounts.google.com/o/oauth2/auth');
    }

    public function test_google_callback_links_an_existing_account_by_email(): void
    {
        $user = User::factory()->create([
            'email' => 'jane@example.com',
            'email_verified_at' => null,
        ]);

        $this->mockGoogleUser(
            id: 'google-123',
            name: 'Jane Example',
            email: 'jane@example.com',
            avatar: 'https://example.com/avatar.jpg',
        );

        $response = $this->get(route('google.callback'));

        $this->assertAuthenticatedAs($user->fresh());
        $response->assertRedirect(config('fortify.home'));
        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertDatabaseHas('users', [
            'user_id' => $user->user_id,
            'google_id' => 'google-123',
            'avatar' => 'https://example.com/avatar.jpg',
        ]);
    }

    public function test_google_callback_creates_a_new_alumni_account_when_needed(): void
    {
        $this->mockGoogleUser(
            id: 'google-456',
            name: 'New Alumni',
            email: 'new.alumni@example.com',
            avatar: 'https://example.com/new-avatar.jpg',
        );

        $response = $this->get(route('google.callback'));

        $user = User::query()
            ->where('email', 'new.alumni@example.com')
            ->firstOrFail();

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('survey.personal', absolute: false));
        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertDatabaseHas('users', [
            'user_id' => $user->user_id,
            'user_type' => 'alumni',
            'google_id' => 'google-456',
        ]);
        $this->assertDatabaseHas('alumni', [
            'user_id' => $user->user_id,
        ]);
    }

    private function mockGoogleUser(string $id, string $name, string $email, string $avatar): void
    {
        $googleUser = Mockery::mock(ProviderUser::class);
        $googleUser->shouldReceive('getId')->andReturn($id);
        $googleUser->shouldReceive('getName')->andReturn($name);
        $googleUser->shouldReceive('getEmail')->andReturn($email);
        $googleUser->shouldReceive('getAvatar')->andReturn($avatar);

        $provider = Mockery::mock(Provider::class);
        $provider->shouldReceive('user')->once()->andReturn($googleUser);

        Socialite::shouldReceive('driver')
            ->once()
            ->with('google')
            ->andReturn($provider);
    }
}
