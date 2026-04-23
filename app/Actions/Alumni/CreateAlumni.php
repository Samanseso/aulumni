<?php

namespace App\Actions\Alumni;

use App\Actions\Fortify\CreateNewUser;
use App\Models\Alumni;
use App\Models\AlumniAcademicDetails;
use App\Models\AlumniContactDetails;
use App\Models\AlumniEmploymentDetails;
use App\Models\AlumniPersonalDetails;
use Illuminate\Support\Facades\DB;

class CreateAlumni
{
    public function create(array $payload): Alumni
    {
        return $this->createMany([$payload])[0];
    }

    public function createMany(array $payloads): array
    {
        if (empty($payloads)) {
            return [];
        }

        $alumniIds = $this->reserveAlumniIds(count($payloads));

        $userAction = app(CreateNewUser::class);
        $results    = [];

        $personalRows    = [];
        $academicRows    = [];
        $contactRows     = [];
        $employmentRows  = [];
        $alumniRows      = [];

        $now = now()->toDateTimeString();

        foreach ($payloads as $i => $payload) {
            $alumniId  = $alumniIds[$i];
            $personal  = $payload['personal']   ?? [];
            $contact   = $payload['contact']    ?? [];
            $academic  = $payload['academic']   ?? [];
            $employment = $payload['employment'] ?? [];
            $userInput = $payload['user']        ?? [];

            $name     = $userInput['name']     ?? trim(($personal['first_name'] ?? '') . ' ' . ($personal['last_name'] ?? '')) ?: 'No Name';
            $email    = $userInput['email']    ?? ($contact['email'] ?? null);
            $password = $userInput['password'] ?? null;

            $user = $userAction->create([
                'name'                  => $name,
                'email'                 => $email,
                'user_type'             => $userInput['user_type'] ?? 'alumni',
                'survey_completed'      => $userInput['survey_completed'] ?? false,
                'status'                => $userInput['status'] ?? 'pending',
                'created_by'            => $userInput['created_by'] ?? null,
                'password'              => $password,
                'password_confirmation' => $password,
            ]);

            $alumniRows[]     = ['alumni_id' => $alumniId, 'user_id' => $user->user_id, 'created_at' => $now, 'updated_at' => $now];
            $personalRows[]   = array_merge($personal,   ['alumni_id' => $alumniId, 'created_at' => $now, 'updated_at' => $now]);
            $academicRows[]   = array_merge($academic,   ['alumni_id' => $alumniId, 'created_at' => $now, 'updated_at' => $now]);
            $contactRows[]    = array_merge($contact,    ['alumni_id' => $alumniId, 'created_at' => $now, 'updated_at' => $now]);
            $employmentRows[] = array_merge($employment, ['alumni_id' => $alumniId, 'created_at' => $now, 'updated_at' => $now]);

            $results[$i] = $alumniId;
        }

        Alumni::insert($alumniRows);
        AlumniPersonalDetails::insert($personalRows);
        AlumniAcademicDetails::insert($academicRows);
        AlumniContactDetails::insert($contactRows);
        AlumniEmploymentDetails::insert($employmentRows);

        return Alumni::whereIn('alumni_id', $results)->get()->all();
    }

 
    protected function reserveAlumniIds(int $count): array
    {
        $prefix = date('y') . '-';

        $max = Alumni::where('alumni_id', 'like', $prefix . '%')
            ->selectRaw('MAX(CAST(SUBSTRING(alumni_id, 4) AS UNSIGNED)) as max_seq')
            ->value('max_seq') ?? 0;

        $ids = [];
        for ($i = 1; $i <= $count; $i++) {
            $ids[] = $prefix . sprintf('%05d', $max + $i);
        }

        return $ids;
    }
}
