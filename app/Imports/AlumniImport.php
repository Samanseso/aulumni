<?php

namespace App\Imports;

use App\Actions\Alumni\CreateAlumni;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Validators\Failure;

class AlumniImport implements ToCollection, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;
    protected int $successCount = 0;

    public static function importToDbMap(): array
    {
        return [
            'first_name' => 'first_name',
            'middle_name' => 'middle_name',
            'last_name' => 'last_name',
            'sex' => 'gender',
            'birthday' => 'birthday',
            'mailing_address' => 'mailing_address',
            'where_are_you_based_right_now' => 'present_address',
            'provincial_address' => 'provincial_address',
            'email_address' => 'email',
            'contact_number' => 'contact',
            'facebook_account' => 'facebook_url',
            'degree_earned' => 'course',
            'year_graduated' => 'batch',
            'what_was_your_first_job_after_graduation' => 'first_work_position',
            'how_long_did_it_take_for_you_to_get_this_job' => 'first_work_time_taken',
            'how_did_you_acquire_your_current_job' => 'first_work_acquisition',
            'are_you_currently_employed_in_case_of_unemployed_state_your_reasons_why_you_are_unemployed_in_the_option_other' => 'current_employed',
            'type_of_organization' => 'current_work_type',
            'present_employment_status' => 'current_work_status',
            'name_of_present_employer_company' => 'current_work_company',
            'position' => 'current_work_position',
            'snce_when' => 'current_work_years',
            'number_of_years_in_the_company' => 'current_work_years',
            'monthly_income_range' => 'current_work_monthly_income',
            'how_satisfied_are_you_with_your_job' => 'current_work_satisfaction',
            'what_do_you_think_are_the_skills_knowledge_and_trainings_you_received_from_arellano_university_that_proved_to_be_useful_to_your_current_job_business_further_studies' => 'au_skills',
            'to_what_extent_is_the_usefulness_of_these_acquired_knowledge_skills_and_trainings' => 'au_usefulness',
        ];
    }

    /**
     * Validation rules applied to each row.
     */
    public function rules(): array
    {
        $currentYear = date('Y');

        return [
            '*.status' => ['nullable', 'string', Rule::in(['active', 'pending', 'inactive'])],

            // academic details rules
            '*.student_number' => ['nullable', 'string', 'max:100', Rule::unique('alumni_academic_details', 'student_number')],
            '*.school_level'   => ['nullable', Rule::in(['Elementary', 'High School', 'College', 'Graduate'])],
            '*.year_graduated' => ['nullable', 'digits:4', 'integer', "between:1900,{$currentYear}"],
            '*.branch'         => ['nullable', 'string', 'max:255'],
            '*.degree_earned'  => ['nullable', 'string', 'max:100'],

            // contact details rules
            '*.email_address' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')],
            '*.contact_number' => ['nullable', 'max:20'],
            '*.telephone' => ['nullable', 'string', 'max:50'],
            '*.mailing_address' => ['nullable', 'string', 'max:2000'],
            '*.where_are_you_based_right_now' => ['nullable', 'string', 'max:2000'],
            '*.provincial_address' => ['nullable', 'string', 'max:2000'],
            '*.company_address' => ['nullable', 'string', 'max:255'],
            '*.facebook_account' => ['nullable', 'string', 'max:1000'],
            '*.twitter_url' => ['nullable', 'url', 'max:1000'],
            '*.gmail_url' => ['nullable', 'url', 'max:1000'],
            '*.link_url' => ['nullable', 'url', 'max:1000'],
            '*.other_url' => ['nullable', 'url', 'max:1000'],

            // employment details rules
            '*.what_was_your_first_job_after_graduation' => ['nullable', 'string', 'max:255'],
            '*.how_long_did_it_take_for_you_to_get_this_job' => ['nullable', 'string', 'max:100'],
            '*.how_did_you_acquire_your_current_job' => ['nullable', 'string', 'max:255'],
            '*.are_you_currently_employed_in_case_of_unemployed_state_your_reasons_why_you_are_unemployed_in_the_option_other' => ['nullable', 'string', 'max:255'],
            '*.type_of_organization' => ['nullable', 'string'],
            '*.present_employment_status' => ['nullable', 'string'],
            '*.name_of_present_employer_company' => ['nullable', 'string', 'max:255'],
            '*.position' => ['nullable', 'string', 'max:255'],
            '*.snce_when' => ['nullable', 'string', 'max:50'],
            '*.number_of_years_in_the_company' => ['nullable', 'string', 'max:50'],
            '*.monthly_income_range' => ['nullable', 'string', 'max:50'],
            '*.how_satisfied_are_you_with_your_job' => ['nullable', 'string'],
            '*.what_do_you_think_are_the_skills_knowledge_and_trainings_you_received_from_arellano_university_that_proved_to_be_useful_to_your_current_job_business_further_studies' => ['nullable', 'string', 'max:4000'],
            '*.to_what_extent_is_the_usefulness_of_these_acquired_knowledge_skills_and_trainings' => ['nullable', 'string'],

            // personal details rules
            '*.first_name' => ['required', 'string', 'max:50'],
            '*.middle_name' => ['nullable', 'string', 'max:50'],
            '*.last_name' => ['required', 'string', 'max:50'],
            '*.birthday' => ['nullable', 'date'],
            '*.sex' => ['nullable', Rule::in(['Male', 'Female', 'Other'])],
            '*.photo' => ['nullable', 'string'],
            '*.bio' => ['nullable', 'string', 'max:2000'],
            '*.interest' => ['nullable', 'string', 'max:1000'],
            '*.address' => ['nullable', 'string', 'max:2000'],

        ];
    }

    public function prepareForValidation($data, $index)
    {
        if (isset($data['email_address'])) {
            $data['email_address'] = trim((string) $data['email_address']);
        }

        return $data;
    }

    /**
     * Custom validation messages.
     */
    public function messages()
    {
        return [
            // user table messages]
            '*.status.in' => 'Status must be one of: active, pending, inactive.',

            // academic details messages
            '*.student_number.required' => 'Student number is required.',
            '*.student_number.string' => 'Student number must be a string.',
            '*.student_number.unique' => 'Student number must be unique.',
            '*.student_number.max' => 'Student number must not exceed :max characters.',
            '*.school_level.in' => 'School level must be one of: Elementary, High School, College, Graduate.',
            '*.year_graduated.digits' => 'Year graduated must be a :digits-digit year.',
            '*.year_graduated.integer' => 'Year graduated must be an integer.',
            '*.year_graduated.between' => 'Year graduated must be between 1900 and ' . date('Y') . '.',
            '*.branch.string' => 'Branch must be a string.',
            '*.branch.max' => 'Branch must not exceed :max characters.',
            '*.degree_earned.string' => 'Degree earned must be a string.',
            '*.degree_earned.max' => 'Degree earned must not exceed :max characters.',

            // contact details messages
            '*.email_address.email' => 'Email must be a valid email address.',
            '*.email_address.max' => 'Email must not exceed :max characters.',
            '*.email_address.unique' => 'Email :input is already registered.',
            '*.contact_number.string' => 'Contact must be a string.',
            '*.contact_number.max' => 'Contact must not exceed :max characters.',
            '*.telephone.string' => 'Telephone must be a string.',
            '*.telephone.max' => 'Telephone must not exceed :max characters.',
            '*.mailing_address.string' => 'Mailing address must be a string.',
            '*.mailing_address.max' => 'Mailing address must not exceed :max characters.',
            '*.where_are_you_based_right_now.string' => 'Present address must be a string.',
            '*.where_are_you_based_right_now.max' => 'Present address must not exceed :max characters.',
            '*.provincial_address.string' => 'Provincial address must be a string.',
            '*.provincial_address.max' => 'Provincial address must not exceed :max characters.',
            '*.company_address.string' => 'Company address must be a string.',
            '*.company_address.max' => 'Company address must not exceed :max characters.',
            '*.facebook_account.string' => 'Facebook account must be a string.',
            '*.facebook_account.max' => 'Facebook account must not exceed :max characters.',
            '*.twitter_url.url' => 'Twitter URL must be a valid URL.',
            '*.twitter_url.max' => 'Twitter URL must not exceed :max characters.',
            '*.gmail_url.url' => 'Gmail URL must be a valid URL.',
            '*.gmail_url.max' => 'Gmail URL must not exceed :max characters.',
            '*.link_url.url' => 'Link URL must be a valid URL.',
            '*.link_url.max' => 'Link URL must not exceed :max characters.',
            '*.other_url.url' => 'Other URL must be a valid URL.',
            '*.other_url.max' => 'Other URL must not exceed :max characters.',

            // employment details messages
            '*.what_was_your_first_job_after_graduation.string' => 'First work position must be a string.',
            '*.what_was_your_first_job_after_graduation.max' => 'First work position must not exceed :max characters.',
            '*.how_long_did_it_take_for_you_to_get_this_job.string' => 'First work time taken must be a string.',
            '*.how_long_did_it_take_for_you_to_get_this_job.max' => 'First work time taken must not exceed :max characters.',
            '*.how_did_you_acquire_your_current_job.string' => 'First work acquisition must be a string.',
            '*.how_did_you_acquire_your_current_job.max' => 'First work acquisition must not exceed :max characters.',
            '*.are_you_currently_employed_in_case_of_unemployed_state_your_reasons_why_you_are_unemployed_in_the_option_other.string' => 'Current employed value must be a string.',
            '*.are_you_currently_employed_in_case_of_unemployed_state_your_reasons_why_you_are_unemployed_in_the_option_other.max' => 'Current employed value must not exceed :max characters.',
            '*.type_of_organization.string' => 'Current work type must be a string.',
            '*.present_employment_status.string' => 'Current work status must be a string.',
            '*.name_of_present_employer_company.string' => 'Company must be a string.',
            '*.name_of_present_employer_company.max' => 'Company must not exceed :max characters.',
            '*.position.string' => 'Position must be a string.',
            '*.position.max' => 'Position must not exceed :max characters.',
            '*.snce_when.string' => 'Employee year must be a string.',
            '*.snce_when.max' => 'Employee year must not exceed :max characters.',
            'snce_when.string' => 'Employee year must be a string.',
            'snce_when.max' => 'Employee year must not exceed :max characters.',
            '*.number_of_years_in_the_company.string' => 'Employee years must be a string.',
            '*.number_of_years_in_the_company.max' => 'Employee years must not exceed :max characters.',
            '*.monthly_income_range.string' => 'Monthly income must be a string.',
            '*.monthly_income_range.max' => 'Monthly income must not exceed :max characters.',
            '*.how_satisfied_are_you_with_your_job.string' => 'Satisfaction must be a string.',
            '*.what_do_you_think_are_the_skills_knowledge_and_trainings_you_received_from_arellano_university_that_proved_to_be_useful_to_your_current_job_business_further_studies.string' => 'AU skills must be a string.',
            '*.what_do_you_think_are_the_skills_knowledge_and_trainings_you_received_from_arellano_university_that_proved_to_be_useful_to_your_current_job_business_further_studies.max' => 'AU skills must not exceed :max characters.',
            '*.to_what_extent_is_the_usefulness_of_these_acquired_knowledge_skills_and_trainings.string' => 'AU usefulness must be a string.',

            // personal details messages
            '*.first_name.required' => 'First name is required.',
            '*.first_name.string' => 'First name must be a string.',
            '*.first_name.max' => 'First name must not exceed :max characters.',
            '*.middle_name.string' => 'Middle name must be a string.',
            '*.middle_name.max' => 'Middle name must not exceed :max characters.',
            '*.last_name.required' => 'Last name is required.',
            '*.last_name.string' => 'Last name must be a string.',
            '*.last_name.max' => 'Last name must not exceed :max characters.',
            '*.birthday.date' => 'Birthday must be a valid date.',
            '*.sex.in' => 'Gender must be one of: Male, Female, Other.',
            '*.photo.string' => 'Photo must be a string.',
            '*.bio.string' => 'Bio must be a string.',
            '*.bio.max' => 'Bio must not exceed :max characters.',
            '*.interest.string' => 'Interest must be a string.',
            '*.interest.max' => 'Interest must not exceed :max characters.',
            '*.address.string' => 'Address must be a string.',
            '*.address.max' => 'Address must not exceed :max characters.',
        ];
    }

    public function getSuccessCount(): int
    {
        return $this->successCount;
    }

    /**
     * Process validated rows. Rows that failed validation will not reach here.
     */
    public function collection(Collection $rows)
    {
        $this->successCount = $rows->count();

        foreach ($rows as $row) {
            // Map fields (use null coalescing to be safe)
            $firstName = $row['first_name'] ?? null;
            $middleName = $row['middle_name'] ?? null;
            $lastName = $row['last_name'] ?? null;
            $photo = $row['photo'] ?? null;
            $gender = $row['sex'] ?? null;
            $birthday = $row['birthday'] ?? null;
            $bio = $row['bio'] ?? null;
            $interest = $row['interest'] ?? null;
            $branch = $row['branch'] ?? null;
            $address = $row['mailing_address'] ?? null;

            $studentNumber = $row['student_number'] ?? null;
            $schoolLevel = $row['school_level'] ?? null;
            $batch = $row['year_graduated'] ?? null;
            $course = $row['degree_earned'] ?? null;

            $email = $row['email_address'] ?? null;
            $contact = $row['contact_number'] ?? null;
            $telephone = $row['telephone'] ?? null;
            $mailingAddress = $row['mailing_address'] ?? null;
            $presentAddress = $row['where_are_you_based_right_now'] ?? null;
            $provincialAddress = $row['provincial_address'] ?? null;
            $companyAddress = $row['company_address'] ?? null;
            $facebookUrl = $row['facebook_account'] ?? null;
            $twitterUrl = $row['twitter_url'] ?? null;
            $gmailUrl = $row['gmail_url'] ?? null;
            $linkUrl = $row['link_url'] ?? null;
            $otherUrl = $row['other_url'] ?? null;

            $firstWorkPosition = $row['what_was_your_first_job_after_graduation'] ?? null;
            $firstWorkTimeTaken = $row['how_long_did_it_take_for_you_to_get_this_job'] ?? null;
            $firstWorkAcquisition = $row['how_did_you_acquire_your_current_job'] ?? null;
            $currentEmployed = $row['are_you_currently_employed_in_case_of_unemployed_state_your_reasons_why_you_are_unemployed_in_the_option_other'] ?? null;
            $currentWorkType = $row['type_of_organization'] ?? null;
            $currentWorkStatus = $row['present_employment_status'] ?? null;
            $currentWorkCompany = $row['name_of_present_employer_company'] ?? null;
            $currentWorkPosition = $row['position'] ?? null;
            $currentWorkYears = $row['number_of_years_in_the_company'] ?? ($row['snce_when'] ?? null);
            $currentWorkMonthlyIncome = $row['monthly_income_range'] ?? null;
            $currentWorkSatisfaction = $row['how_satisfied_are_you_with_your_job'] ?? null;
            $auSkills = $row['what_do_you_think_are_the_skills_knowledge_and_trainings_you_received_from_arellano_university_that_proved_to_be_useful_to_your_current_job_business_further_studies'] ?? null;
            $auUsefulness = $row['to_what_extent_is_the_usefulness_of_these_acquired_knowledge_skills_and_trainings'] ?? null;



            $password = Str::upper($firstName[0]) . ($middleName ? Str::lower($middleName[0]) : Str::lower($firstName[1])) . Str::lower($lastName[0]) . "@" . $batch;
            app(CreateAlumni::class)->create([
                'user' => [
                    'name' => trim(($firstName ?? '') . ' ' . ($lastName ?? '')) ?: 'No Name',
                    'email' => $email,
                    'user_type' => 'alumni',
                    'password' => $password,
                ],
                'personal' => [
                    'first_name' => $firstName,
                    'middle_name' => $middleName,
                    'last_name' => $lastName,
                    'photo' => $photo,
                    'gender' => $gender,
                    'birthday' => $birthday,
                    'bio' => $bio,
                    'interest' => $interest,
                    'branch' => $branch,
                    'address' => $address,
                ],
                'academic' => [
                    'student_number' => $studentNumber,
                    'school_level' => $schoolLevel,
                    'batch' => $batch,
                    'branch' => $branch,
                    'course' => $course,
                ],
                'contact' => [
                    'email' => $email,
                    'contact' => $contact,
                    'telephone' => $telephone,
                    'mailing_address' => $mailingAddress,
                    'present_address' => $presentAddress,
                    'provincial_address' => $provincialAddress,
                    'company_address' => $companyAddress,
                    'facebook_url' => $facebookUrl,
                    'twitter_url' => $twitterUrl,
                    'gmail_url' => $gmailUrl,
                    'link_url' => $linkUrl,
                    'other_url' => $otherUrl,
                ],
                'employment' => [
                    'first_work_position' => $firstWorkPosition,
                    'first_work_time_taken' => $firstWorkTimeTaken,
                    'first_work_acquisition' => $firstWorkAcquisition,
                    'current_employed' => $currentEmployed,
                    'current_work_type' => $currentWorkType,
                    'current_work_status' => $currentWorkStatus,
                    'current_work_company' => $currentWorkCompany,
                    'current_work_position' => $currentWorkPosition,
                    'current_work_years' => $currentWorkYears,
                    'current_work_monthly_income' => $currentWorkMonthlyIncome,
                    'current_work_satisfaction' => $currentWorkSatisfaction,
                    'au_skills' => $auSkills,
                    'au_usefulness' => $auUsefulness,
                ],
            ]);
        }
    }
}
