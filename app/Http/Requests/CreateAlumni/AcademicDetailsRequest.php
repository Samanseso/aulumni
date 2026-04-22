<?php

namespace App\Http\Requests\CreateAlumni;

use App\Models\Course;
use App\Models\Department;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AcademicDetailsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $currentYear = date('Y');

        return [
            'student_number' => ['required', 'string', 'max:100'],
            'school_level'   => ['required', 'in:College,Graduate'],
            'batch'          => ['required', 'digits:4', 'integer', "between:1900,{$currentYear}", Rule::exists('batch', 'year')],
            'branch_id'      => ['required', 'integer', Rule::exists('branches', 'branch_id')],
            'department_id'  => ['nullable', 'integer', Rule::exists('departments', 'department_id')],
            'course_id'      => ['nullable', 'integer', Rule::exists('courses', 'course_id')],
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

    public function messages(): array
    {
        $currentYear = date('Y');

        return [
            'student_number.required' => 'Student number is required.',
            'student_number.string'   => 'Student number must be a string.',
            'student_number.max'      => 'Student number may not be greater than 100 characters.',

            'school_level.required'   => 'School level is required.',
            'school_level.in'         => 'School level must be College, or Graduate.',

            'batch.required'          => 'Batch is required.',
            'batch.digits'            => 'Batch must be a four digit year (e.g., 2020).',
            'batch.integer'           => 'Batch must be a valid year.',
            'batch.between'           => "Batch must be between 1900 and {$currentYear}.",
            'batch.exists'            => 'Selected batch does not exist.',

            'branch_id.required'      => 'Branch is required.',
            'branch_id.integer'       => 'Branch must be a valid branch.',
            'branch_id.exists'        => 'Selected branch does not exist.',

            'department_id.integer'   => 'Department must be a valid department.',
            'department_id.exists'    => 'Selected department does not exist.',

            'course_id.integer'       => 'Course must be a valid course.',
            'course_id.exists'        => 'Selected course does not exist.',
        ];
    }
}
