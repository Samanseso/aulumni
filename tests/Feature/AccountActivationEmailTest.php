<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\AccountActivatedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AccountActivationEmailTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_receives_an_activation_email_when_activated(): void
    {
        Notification::fake();

        $admin = User::factory()->create([
            'user_type' => 'admin',
            'status' => 'active',
        ]);

        $user = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'pending',
        ]);

        $this->actingAs($admin)
            ->patch(route('user.activate', $user))
            ->assertRedirect();

        $this->assertSame('active', $user->fresh()->status);

        Notification::assertSentTo($user, AccountActivatedNotification::class);
    }

    public function test_bulk_activation_only_emails_users_that_were_just_activated(): void
    {
        Notification::fake();

        $admin = User::factory()->create([
            'user_type' => 'admin',
            'status' => 'active',
        ]);

        $pendingUser = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'pending',
        ]);

        $inactiveUser = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'inactive',
        ]);

        $alreadyActiveUser = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'active',
        ]);

        $this->actingAs($admin)
            ->post(route('user.bulk_activate'), [
                'user_ids' => [
                    $pendingUser->user_id,
                    $inactiveUser->user_id,
                    $alreadyActiveUser->user_id,
                ],
            ])
            ->assertRedirect();

        $this->assertSame('active', $pendingUser->fresh()->status);
        $this->assertSame('active', $inactiveUser->fresh()->status);
        $this->assertSame('active', $alreadyActiveUser->fresh()->status);

        Notification::assertSentTo($pendingUser, AccountActivatedNotification::class);
        Notification::assertSentTo($inactiveUser, AccountActivatedNotification::class);
        Notification::assertNotSentTo($alreadyActiveUser, AccountActivatedNotification::class);
    }
}
