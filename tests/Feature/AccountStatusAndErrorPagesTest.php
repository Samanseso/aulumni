<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountStatusAndErrorPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_pending_users_are_redirected_to_the_pending_page(): void
    {
        $user = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->get(route('home'))
            ->assertRedirect(route('account.pending'));
    }

    public function test_pending_page_is_displayed_for_pending_users(): void
    {
        $user = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->get(route('account.pending'))
            ->assertOk()
            ->assertSee('Waiting for activation');
    }

    public function test_inactive_users_are_redirected_to_the_inactive_page(): void
    {
        $user = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'inactive',
        ]);

        $this->actingAs($user)
            ->get(route('home'))
            ->assertRedirect(route('account.inactive'));
    }

    public function test_inactive_page_is_displayed_for_inactive_users(): void
    {
        $user = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'inactive',
        ]);

        $this->actingAs($user)
            ->get(route('account.inactive'))
            ->assertOk()
            ->assertSee('Access is disabled');
    }

    public function test_custom_404_page_is_rendered(): void
    {
        $this->get('/missing-page-for-testing')
            ->assertStatus(404)
            ->assertSee('Page not found');
    }

    public function test_custom_405_page_is_rendered(): void
    {
        $this->get('/logout')
            ->assertStatus(405)
            ->assertSee('Method not allowed');
    }

    public function test_custom_403_page_is_rendered(): void
    {
        $user = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'active',
        ]);

        $this->actingAs($user)
            ->get(route('branch.index'))
            ->assertStatus(403)
            ->assertSee('Access denied');
    }
}
