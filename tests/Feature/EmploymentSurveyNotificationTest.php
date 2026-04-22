<?php

namespace Tests\Feature;

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
}
