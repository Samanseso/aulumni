<?php

namespace App\Actions\Alumni;

use App\Actions\Fortify\CreateNewUser;
use App\Models\Alumni;
use App\Models\AlumniAcademicDetails;
use App\Models\AlumniContactDetails;
use App\Models\AlumniEmploymentDetails;
use App\Models\AlumniPersonalDetails;

class CreateAlumni
{
    public function create(array $payload): Alumni
    {
        $alumniId = $payload['alumni_id'] ?? $this->generateAlumniId();

        $personal = $payload['personal'] ?? [];
        $contact = $payload['contact'] ?? [];
        $academic = $payload['academic'] ?? [];
        $employment = $payload['employment'] ?? [];
        $userInput = $payload['user'] ?? [];

        $name = $userInput['name'] ?? trim(($personal['first_name'] ?? '') . ' ' . ($personal['last_name'] ?? '')) ?: 'No Name';
        $email = $userInput['email'] ?? ($contact['email'] ?? null);
        $password = $userInput['password'] ?? null;

        $user = app(CreateNewUser::class)->create([
            'name' => $name,
            'email' => $email,
            'user_type' => $userInput['user_type'] ?? 'alumni',
            'password' => $password,
            'password_confirmation' => $password,
        ]);

        $alumni = Alumni::updateOrCreate(
            [
                'alumni_id' => $alumniId,
                'user_id' => $user->user_id,
            ],
        );

        AlumniPersonalDetails::updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($personal, ['alumni_id' => $alumni->alumni_id])
        );

        AlumniAcademicDetails::updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($academic, ['alumni_id' => $alumni->alumni_id])
        );

        AlumniContactDetails::updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($contact, ['alumni_id' => $alumni->alumni_id])
        );

        AlumniEmploymentDetails::updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($employment, ['alumni_id' => $alumni->alumni_id])
        );

        return $alumni;
    }

    protected function generateAlumniId(): string
    {
        $attempt = 0;
        do {
            $attempt++;
            $alumniId = date('y') . "-" . sprintf('%05d', $attempt);

            if (Alumni::where('alumni_id', $alumniId)->count() == 0) {
                break;
            }
        } while ($attempt < 99999);

        return $alumniId;
    }
}
