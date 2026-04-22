<?php

namespace App\Http\Requests;

use App\Models\Course;
use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class EmploymentSurveySignupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $currentYear = date('Y');
        $userId = $this->user()?->user_id;
        $guestPasswordRules = $userId === null
            ? ['required', 'string', Password::default(), 'confirmed']
            : ['nullable', 'string', Password::default(), 'confirmed'];

        return [
            'first_name' => ['required', 'string', 'max:50'],
            'middle_name' => ['required', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'birthday' => ['required', 'date'],
            'gender' => ['required', 'in:Male,Female,Other'],
            'photo' => ['nullable', 'string'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'interest' => ['nullable', 'string', 'max:1000'],
            'address' => ['nullable', 'string', 'max:2000'],

            'student_number' => ['required', 'string', 'max:100'],
            'school_level' => ['required', 'in:College,Graduate'],
            'batch' => ['required', 'digits:4', 'integer', "between:1900,{$currentYear}", Rule::exists('batch', 'year')],
            'branch_id' => ['required', 'integer', Rule::exists('branches', 'branch_id')],
            'department_id' => ['nullable', 'integer', Rule::exists('departments', 'department_id')],
            'course_id' => ['nullable', 'integer', Rule::exists('courses', 'course_id')],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                $userId === null
                    ? Rule::unique(User::class)
                    : Rule::unique(User::class)->ignore($userId, 'user_id'),
            ],
            'contact' => ['nullable', 'string', 'max:11'],
            'telephone' => ['nullable', 'string', 'max:50'],
            'mailing_address' => ['nullable', 'string', 'max:2000'],
            'present_address' => ['nullable', 'string', 'max:2000'],
            'provincial_address' => ['nullable', 'string', 'max:2000'],
            'company_address' => ['nullable', 'string', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:1000'],
            'twitter_url' => ['nullable', 'url', 'max:1000'],
            'gmail_url' => ['nullable', 'url', 'max:1000'],
            'link_url' => ['nullable', 'url', 'max:1000'],
            'other_url' => ['nullable', 'url', 'max:1000'],

            'password' => $guestPasswordRules,

            'first_work_position' => ['nullable', 'string', 'max:255'],
            'first_work_time_taken' => ['nullable', 'in:Less than a month,1 - 6 months,7 - 11 months,1 yr. to less than 2 yrs.,2 yrs. to less than 3 yrs.,3 yrs. to less than 4 yrs.,More than 4 yrs.'],
            'first_work_acquisition' => ['nullable', 'in:Personally applied for the job,Arranged by school\'s job placement,Recommended by AU faculty/dean,Directly invited by the company,Other'],
            'current_employed' => ['nullable', 'in:Yes,No,Self employed,Managing own company / business,Retired,Never employed,Other'],
            'current_work_type' => ['nullable', 'in:Private,Public,NGO,Other'],
            'current_work_status' => ['nullable', 'in:Regular/Permanent,Casual,Part Time,Contractual'],
            'current_work_company' => ['nullable', 'string', 'max:255'],
            'current_work_position' => ['nullable', 'string', 'max:255'],
            'current_work_years' => ['nullable', 'in:1 - 5,6 - 10,11 - 15,16 - 20,21 - 25,25 above'],
            'current_work_monthly_income' => ['nullable'],
            'current_work_satisfaction' => ['nullable', 'in:Very satisfied,Satisfied,Dissatisfied,Very dissatisfied'],
            'au_skills' => ['nullable', 'string', 'max:4000'],
            'au_usefulness' => ['nullable', 'in:Very useful,Moderately useful,Occasionally useful,Not at all useful'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $schoolLevel = $this->string('school_level')->toString();
            $branchId = $this->integer('branch_id');
            $departmentId = $this->integer('department_id');
            $courseId = $this->integer('course_id');
            $requiresAcademicProgram = in_array($schoolLevel, ['College', 'Graduate'], true);

            if ($requiresAcademicProgram && ! $departmentId) {
                $validator->errors()->add('department_id', 'Department is required for the selected school level.');
            }

            if ($requiresAcademicProgram && ! $courseId) {
                $validator->errors()->add('course_id', 'Course is required for the selected school level.');
            }

            if ($departmentId) {
                $departmentMatchesBranch = Department::query()
                    ->where('department_id', $departmentId)
                    ->where('branch_id', $branchId)
                    ->exists();

                if (! $departmentMatchesBranch) {
                    $validator->errors()->add('department_id', 'Selected department does not belong to the selected branch.');
                }
            }

            if ($courseId) {
                $courseQuery = Course::query()->where('course_id', $courseId);

                if ($branchId) {
                    $courseQuery->where('branch_id', $branchId);
                }

                if ($departmentId) {
                    $courseQuery->where('department_id', $departmentId);
                }

                if (! $courseQuery->exists()) {
                    $validator->errors()->add('course_id', 'Selected course does not belong to the selected branch and department.');
                }
            }
        });
    }
}
