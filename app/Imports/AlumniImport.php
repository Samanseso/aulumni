<?php

namespace App\Imports;

use App\Jobs\ImportAlumniRow;
use App\Models\Branch;
use App\Models\Course;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class AlumniImport implements ToCollection, WithHeadingRow, WithValidation, SkipsOnFailure, WithChunkReading
{
    use SkipsFailures;

    protected int $successCount = 0;

    /** Keyed caches built once per chunk: lower(name) => model */
    private array $branchCache = [];
    private array $courseByCodeCache  = [];
    private array $courseByNameCache  = [];

    public function chunkSize(): int
    {
        return 100;
    }

    // -------------------------------------------------------------------------
    // Field map (unchanged from original)
    // -------------------------------------------------------------------------
    public static function importToDbMap(): array
    {
        return [
            'first_name'       => 'first_name',
            'middle_name'      => 'middle_name',
            'last_name'        => 'last_name',
            'sex'              => 'gender',
            'birthday'         => 'birthday',
            'mailing_address'  => 'mailing_address',
            'where_are_you_based_right_now' => 'present_address',
            'provincial_address' => 'provincial_address',
            'email_address'    => 'email',
            'contact_number'   => 'contact',
            'facebook_account' => 'facebook_url',
            'degree_earned'    => 'course',
            'year_graduated'   => 'batch',
            'what_was_your_first_job_after_graduation'          => 'first_work_position',
            'how_long_did_it_take_for_you_to_get_this_job'      => 'first_work_time_taken',
            'how_did_you_acquire_your_current_job'              => 'first_work_acquisition',
            'are_you_currently_employed_in_case_of_unemployed_state_your_reasons_why_you_are_unemployed_in_the_option_other' => 'current_employed',
            'type_of_organization'          => 'current_work_type',
            'present_employment_status'     => 'current_work_status',
            'name_of_present_employer_company' => 'current_work_company',
            'position'                      => 'current_work_position',
            'snce_when'                     => 'current_work_years',
            'number_of_years_in_the_company' => 'current_work_years',
            'monthly_income_range'          => 'current_work_monthly_income',
            'how_satisfied_are_you_with_your_job' => 'current_work_satisfaction',
            'what_do_you_think_are_the_skills_knowledge_and_trainings_you_received_from_arellano_university_that_proved_to_be_useful_to_your_current_job_business_further_studies' => 'au_skills',
            'to_what_extent_is_the_usefulness_of_these_acquired_knowledge_skills_and_trainings' => 'au_usefulness',
        ];
    }

    // -------------------------------------------------------------------------
    // Validation (identical rules / messages, just moved here cleanly)
    // -------------------------------------------------------------------------
    public function rules(): array
    {
        $currentYear = date('Y');

        return [
            '*.status'        => ['nullable', 'string', Rule::in(['active', 'pending', 'inactive'])],
            '*.student_number' => ['nullable', 'string', 'max:100', Rule::unique('alumni_academic_details', 'student_number')],
            '*.school_level'  => ['nullable', Rule::in(['College', 'Graduate'])],
            '*.year_graduated' => ['nullable', 'digits:4', 'integer', "between:1900,{$currentYear}"],
            '*.branch'        => ['nullable', 'string', 'max:255'],
            '*.degree_earned' => ['nullable', 'string', 'max:100'],
            '*.email_address' => ['nullable', 'email'],
            '*.contact_number' => ['nullable', 'max:20'],
            '*.telephone'     => ['nullable', 'string', 'max:50'],
            '*.mailing_address' => ['nullable', 'string', 'max:2000'],
            '*.where_are_you_based_right_now' => ['nullable', 'string', 'max:2000'],
            '*.provincial_address' => ['nullable', 'string', 'max:2000'],
            '*.company_address' => ['nullable', 'string', 'max:255'],
            '*.facebook_account' => ['nullable', 'string', 'max:1000'],
            '*.twitter_url'   => ['nullable', 'url', 'max:1000'],
            '*.gmail_url'     => ['nullable', 'url', 'max:1000'],
            '*.link_url'      => ['nullable', 'url', 'max:1000'],
            '*.other_url'     => ['nullable', 'url', 'max:1000'],
            '*.what_was_your_first_job_after_graduation' => ['nullable', 'string', 'max:255'],
            '*.how_long_did_it_take_for_you_to_get_this_job' => ['nullable', 'string', 'max:100'],
            '*.how_did_you_acquire_your_current_job' => ['nullable', 'string', 'max:255'],
            '*.are_you_currently_employed_in_case_of_unemployed_state_your_reasons_why_you_are_unemployed_in_the_option_other' => ['nullable', 'string', 'max:255'],
            '*.type_of_organization' => ['nullable', 'string'],
            '*.present_employment_status' => ['nullable', 'string'],
            '*.name_of_present_employer_company' => ['nullable', 'string', 'max:255'],
            '*.position'      => ['nullable', 'string', 'max:255'],
            '*.snce_when'     => ['nullable', 'string', 'max:50'],
            '*.number_of_years_in_the_company' => ['nullable', 'string', 'max:50'],
            '*.monthly_income_range' => ['nullable', 'string', 'max:50'],
            '*.how_satisfied_are_you_with_your_job' => ['nullable', 'string'],
            '*.what_do_you_think_are_the_skills_knowledge_and_trainings_you_received_from_arellano_university_that_proved_to_be_useful_to_your_current_job_business_further_studies' => ['nullable', 'string', 'max:4000'],
            '*.to_what_extent_is_the_usefulness_of_these_acquired_knowledge_skills_and_trainings' => ['nullable', 'string'],
            '*.first_name'    => ['required', 'string', 'max:50'],
            '*.middle_name'   => ['nullable', 'string', 'max:50'],
            '*.last_name'     => ['required', 'string', 'max:50'],
            '*.birthday'      => ['nullable', 'date'],
            '*.sex'           => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            '*.photo'         => ['nullable', 'string'],
            '*.bio'           => ['nullable', 'string', 'max:2000'],
            '*.interest'      => ['nullable', 'string', 'max:1000'],
            '*.address'       => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function prepareForValidation($data, $index)
    {
        if (isset($data['email_address'])) {
            $data['email_address'] = trim((string) $data['email_address']);
        }

        return $data;
    }

    public function messages(): array
    {
        $year = date('Y');

        return [
            '*.status.in'                => 'Status must be one of: active, pending, inactive.',
            '*.student_number.unique'    => 'Student number must be unique.',
            '*.school_level.in'          => 'School level must be one of: College, Graduate.',
            '*.year_graduated.digits'    => 'Year graduated must be a 4-digit year.',
            '*.year_graduated.between'   => "Year graduated must be between 1900 and {$year}.",
            '*.email_address.email'      => 'Email must be a valid email address.',
            '*.email_address.unique'     => 'Email :input is already registered.',
            '*.sex.in'                   => 'Gender must be one of: Male, Female, Other.',
            '*.first_name.required'      => 'First name is required.',
            '*.last_name.required'       => 'Last name is required.',
            '*.birthday.date'            => 'Birthday must be a valid date.',
        ];
    }

    public function getSuccessCount(): int
    {
        return $this->successCount;
    }


    public function collection(Collection $rows): void
    {
        if ($rows->isEmpty()) {
            return;
        }

        $this->buildLookupCaches($rows);

        $this->successCount += $rows->count();

        foreach ($rows as $row) {
            [$branchModel, $courseModel] = $this->resolveAcademicModels($row);

            ImportAlumniRow::dispatch(
                $this->buildPayload($row, $branchModel, $courseModel)
            );
        }
    }

    private function buildLookupCaches(Collection $rows): void
    {
        $branchNames = $rows
            ->pluck('branch')
            ->filter()
            ->map(fn ($v) => strtolower(trim((string) $v)))
            ->unique()
            ->values()
            ->all();

        $courseValues = $rows
            ->pluck('degree_earned')
            ->filter()
            ->map(fn ($v) => strtolower(trim((string) $v)))
            ->unique()
            ->values()
            ->all();

        if ($branchNames) {
            Branch::query()
                ->whereRaw('LOWER(name) IN (' . implode(',', array_fill(0, count($branchNames), '?')) . ')', $branchNames)
                ->get()
                ->each(function (Branch $b) {
                    $this->branchCache[strtolower(trim($b->name))] = $b;
                });
        }

        if ($courseValues) {
            $placeholders = implode(',', array_fill(0, count($courseValues), '?'));

            Course::query()
                ->where(function ($q) use ($courseValues, $placeholders) {
                    $q->whereRaw("LOWER(code) IN ({$placeholders})", $courseValues)
                      ->orWhereRaw("LOWER(name) IN ({$placeholders})", $courseValues);
                })
                ->get()
                ->each(function (Course $c) {
                    $this->courseByCodeCache[strtolower(trim((string) $c->code))] = $c;
                    $this->courseByNameCache[strtolower(trim((string) $c->name))] = $c;
                });
        }
    }


    private function resolveAcademicModels($row): array
    {
        $branchKey = strtolower(trim((string) ($row['branch'] ?? '')));
        $courseKey = strtolower(trim((string) ($row['degree_earned'] ?? '')));

        $branchModel = $branchKey ? ($this->branchCache[$branchKey] ?? null) : null;

        $courseModel = $courseKey
            ? ($this->courseByCodeCache[$courseKey] ?? $this->courseByNameCache[$courseKey] ?? null)
            : null;

        // Fall back: derive branch from the course's branch_id
        if ($courseModel && ! $branchModel && $courseModel->branch_id) {
            $branchModel = $this->branchCache["__id_{$courseModel->branch_id}"]
                ??= Branch::query()->find($courseModel->branch_id);
        }

        return [$branchModel, $courseModel];
    }


    private function buildPayload($row, ?Branch $branchModel, ?Course $courseModel): array
    {
        $firstName = $row['first_name'] ?? null;
        $lastName  = $row['last_name']  ?? null;
        $email     = isset($row['email_address']) ? trim((string) $row['email_address']) : null;

        return [
            'user' => [
                'name'      => trim(($firstName ?? '') . ' ' . ($lastName ?? '')) ?: 'No Name',
                'email'     => $email,
                'user_type' => 'alumni',
                'password'  => '12345678',
            ],
            'personal' => [
                'first_name'  => $firstName,
                'middle_name' => $row['middle_name']  ?? null,
                'last_name'   => $lastName,
                'photo'       => $row['photo']        ?? null,
                'gender'      => $row['sex']          ?? null,
                'birthday'    => $row['birthday']     ?? null,
                'bio'         => $row['bio']          ?? null,
                'interest'    => $row['interest']     ?? null,
                'branch'      => $row['branch']       ?? null,
                'address'     => $row['mailing_address'] ?? null,
            ],
            'academic' => [
                'student_number' => $row['student_number'] ?? null,
                'school_level'   => $row['school_level']   ?? null,
                'batch'          => $row['year_graduated']  ?? null,
                'branch_id'      => $branchModel?->branch_id,
                'department_id'  => $courseModel?->department_id,
                'course_id'      => $courseModel?->course_id,
                'branch'         => $branchModel?->name ?? ($row['branch'] ?? null),
                'course'         => $courseModel
                    ? ($courseModel->code ?: $courseModel->name)
                    : ($row['degree_earned'] ?? null),
            ],
            'contact' => [
                'email'            => $email,
                'contact'          => $row['contact_number']   ?? null,
                'telephone'        => $row['telephone']        ?? null,
                'mailing_address'  => $row['mailing_address']  ?? null,
                'present_address'  => $row['where_are_you_based_right_now'] ?? null,
                'provincial_address' => $row['provincial_address'] ?? null,
                'company_address'  => $row['company_address']  ?? null,
                'facebook_url'     => $row['facebook_account'] ?? null,
                'twitter_url'      => $row['twitter_url']      ?? null,
                'gmail_url'        => $row['gmail_url']        ?? null,
                'link_url'         => $row['link_url']         ?? null,
                'other_url'        => $row['other_url']        ?? null,
            ],
            'employment' => [
                'first_work_position'        => $row['what_was_your_first_job_after_graduation'] ?? null,
                'first_work_time_taken'       => $row['how_long_did_it_take_for_you_to_get_this_job'] ?? null,
                'first_work_acquisition'      => $row['how_did_you_acquire_your_current_job'] ?? null,
                'current_employed'            => $row['are_you_currently_employed_in_case_of_unemployed_state_your_reasons_why_you_are_unemployed_in_the_option_other'] ?? null,
                'current_work_type'           => $row['type_of_organization'] ?? null,
                'current_work_status'         => $row['present_employment_status'] ?? null,
                'current_work_company'        => $row['name_of_present_employer_company'] ?? null,
                'current_work_position'       => $row['position'] ?? null,
                'current_work_years'          => $row['number_of_years_in_the_company'] ?? ($row['snce_when'] ?? null),
                'current_work_monthly_income' => $row['monthly_income_range'] ?? null,
                'current_work_satisfaction'   => $row['how_satisfied_are_you_with_your_job'] ?? null,
                'au_skills'                   => $row['what_do_you_think_are_the_skills_knowledge_and_trainings_you_received_from_arellano_university_that_proved_to_be_useful_to_your_current_job_business_further_studies'] ?? null,
                'au_usefulness'               => $row['to_what_extent_is_the_usefulness_of_these_acquired_knowledge_skills_and_trainings'] ?? null,
            ],
        ];
    }
}