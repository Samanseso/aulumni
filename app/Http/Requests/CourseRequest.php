<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'department_id' => 'required|integer|exists:departments,department_id',
            'name'          => 'required|string|max:200',
            'degree'        => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'department_id.required' => 'Department is required.',
            'department_id.integer'  => 'Department ID must be an integer.',
            'department_id.exists'   => 'Selected department does not exist.',

            'name.required'          => 'Course name is required.',
            'name.string'            => 'Course name must be a valid string.',
            'name.max'               => 'Course name may not be greater than 200 characters.',

            'degree.string'          => 'Degree must be a valid string.',
            'degree.max'             => 'Degree may not be greater than 100 characters.',
        ];
    }
}
