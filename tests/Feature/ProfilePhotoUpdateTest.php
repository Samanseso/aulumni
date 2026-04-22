<?php

namespace Tests\Feature;

use App\Models\Alumni;
use App\Models\AlumniPersonalDetails;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProfilePhotoUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_alumni_can_update_their_profile_photo(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'active',
        ]);

        $alumni = Alumni::query()->create([
            'alumni_id' => '26-00001',
            'user_id' => $user->user_id,
        ]);

        $response = $this->actingAs($user)
            ->from('/'.$user->user_name)
            ->post(route('news-feed.update_profile_photo'), [
                'photo' => UploadedFile::fake()->image('profile-photo.jpg'),
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/'.$user->user_name);

        $user->refresh();
        $personalDetails = AlumniPersonalDetails::query()->findOrFail($alumni->alumni_id);

        $this->assertNotNull($user->avatar);
        $this->assertSame($user->avatar, $personalDetails->photo);

        $publicPath = parse_url($user->avatar, PHP_URL_PATH);

        $this->assertIsString($publicPath);

        Storage::disk('public')->assertExists(Str::after($publicPath, '/storage/'));
    }

    public function test_only_alumni_users_can_update_their_profile_photo(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'user_type' => 'admin',
            'status' => 'active',
        ]);

        $this->actingAs($user)
            ->post(route('news-feed.update_profile_photo'), [
                'photo' => UploadedFile::fake()->image('profile-photo.jpg'),
            ])
            ->assertForbidden();
    }
}
