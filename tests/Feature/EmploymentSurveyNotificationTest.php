<?php

namespace Tests\Feature;

use App\Actions\Alumni\CreateAlumni;
use App\Actions\Fortify\CreateNewUser;
use App\Models\Alumni;
use App\Models\Branch;
use App\Models\User;
use App\Notifications\EmploymentSurveySubmittedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class EmploymentSurveyNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_pending_alumni_submission_notifies_active_admins(): void
    {
        Notification::fake();

        $admin = User::factory()->create([
            'user_type' => 'admin',
            'status' => 'active',
        ]);

        $alumniUser = User::factory()->create([
            'user_type' => 'alumni',
            'status' => 'pending',
        ]);

        $branch = Branch::query()->create([
            'name' => 'Main Campus',
            'address' => 'Legarda',
            'contact' => '1234567',
        ]);

        Alumni::query()->create([
            'alumni_id' => '26-00001',
            'user_id' => $alumniUser->user_id,
        ]);

        $response = $this->actingAs($alumniUser)
            ->withSession([
                'survey_personal' => [
                    'first_name' => 'Jane',
                    'middle_name' => 'D',
                    'last_name' => 'Doe',
                    'birthday' => '2000-01-01',
                    'gender' => 'Female',
                ],
                'survey_academic' => [
                    'student_number' => '2024-0001',
                    'school_level' => 'College',
                    'batch' => '2024',
                    'branch_id' => $branch->branch_id,
                ],
                'survey_contact' => [
                    'email_address' => 'jane@example.com',
                    'mobile_number' => '09123456789',
                    'complete_address' => 'Manila',
                ],
            ])
            ->post(route('survey.employment.store'), [
                'current_employed' => 'Yes',
                'current_company_name' => 'Acme Corp',
                'current_job_position' => 'Developer',
            ]);

        $response->assertRedirect(route('home'));

        Notification::assertSentTo($admin, EmploymentSurveySubmittedNotification::class);
    }

    public function test_signup_then_first_survey_completion_notifies_admins(): void
    {
        Notification::fake();

        $admin = User::factory()->create([
            'user_type' => 'admin',
            'status' => 'active',
        ]);

        $branch = Branch::query()->create([
            'name' => 'Main Campus',
            'address' => 'Legarda',
            'contact' => '1234567',
        ]);

        $alumniUser = app(CreateNewUser::class)->create([
            'name' => 'Pending Alumni',
            'email' => 'pending.alumni@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'user_type' => 'alumni',
            'status' => 'pending',
            'bootstrap_alumni_profile' => true,
        ]);

        $alumniUser->forceFill([
            'email_verified_at' => now(),
        ])->save();

        $response = $this->actingAs($alumniUser)
            ->withSession([
                'survey_personal' => [
                    'first_name' => 'Pending',
                    'middle_name' => 'A',
                    'last_name' => 'Alumni',
                    'birthday' => '2000-01-01',
                    'gender' => 'Female',
                ],
                'survey_academic' => [
                    'student_number' => '2024-0002',
                    'school_level' => 'College',
                    'batch' => '2024',
                    'branch_id' => $branch->branch_id,
                ],
                'survey_contact' => [
                    'email_address' => 'pending.alumni@example.com',
                    'mobile_number' => '09123456780',
                    'complete_address' => 'Manila',
                ],
            ])
            ->post(route('survey.employment.store'), [
                'current_employed' => 'Yes',
                'current_company_name' => 'Acme Corp',
                'current_job_position' => 'Developer',
            ]);

        $response->assertRedirect(route('home'));

        Notification::assertSentTo($admin, EmploymentSurveySubmittedNotification::class);
        $this->assertDatabaseHas('users', [
            'user_id' => $alumniUser->user_id,
            'survey_completed' => 1,
        ]);
    }

    public function test_create_alumni_respects_survey_completed_flag(): void
    {
        $branch = Branch::query()->create([
            'name' => 'Main Campus',
            'address' => 'Legarda',
            'contact' => '1234567',
        ]);

        $alumni = app(CreateAlumni::class)->create([
            'user' => [
                'name' => 'Survey Complete',
                'email' => 'survey.complete@example.com',
                'user_type' => 'alumni',
                'password' => 'password',
                'status' => 'pending',
                'survey_completed' => true,
            ],
            'personal' => [
                'first_name' => 'Survey',
                'middle_name' => 'C',
                'last_name' => 'Complete',
            ],
            'academic' => [
                'student_number' => '2024-0003',
                'school_level' => 'College',
                'batch' => '2024',
                'branch_id' => $branch->branch_id,
            ],
            'contact' => [
                'email' => 'survey.complete@example.com',
                'contact' => '09123456781',
            ],
            'employment' => [
                'current_employed' => 'Yes',
            ],
        ]);

        $this->assertTrue((bool) $alumni->user()->firstOrFail()->survey_completed);
    }
}
