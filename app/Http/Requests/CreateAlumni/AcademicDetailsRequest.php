<?php

namespace App\Http\Requests\CreateAlumni;

use Illuminate\Foundation\Http\FormRequest;

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
            'school_level'   => ['required', 'in:Elementary,High School,College,Graduate'],
            'batch'          => ['required', 'digits:4', 'integer', "between:1900,{$currentYear}"],
            'branch'         => ['required', 'string', 'max:255'],
            'course'         => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        $currentYear = date('Y');

        return [
            'student_number.required' => 'Student number is required.',
            'student_number.string'   => 'Student number must be a string.',
            'student_number.max'      => 'Student number may not be greater than 100 characters.',

            'school_level.required'   => 'School level is required.',
            'school_level.in'         => 'School level must be Elementary, High School, College, or Graduate.',

            'batch.required'          => 'Batch is required.',
            'batch.digits'            => 'Batch must be a four digit year (e.g., 2020).',
            'batch.integer'           => 'Batch must be a valid year.',
            'batch.between'           => "Batch must be between 1900 and {$currentYear}.",

            'branch.required'         => 'Branch is required.',
            'branch.string'           => 'Branch must be a string.',
            'branch.max'              => 'Branch may not be greater than 255 characters.',

            'course.required'         => 'Course is required.',
            'course.string'           => 'Course must be a string.',
            'course.max'              => 'Course may not be greater than 100 characters.',
        ];
    }
}
