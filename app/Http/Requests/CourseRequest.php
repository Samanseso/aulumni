<?php

namespace App\Http\Requests;

use App\Models\Department;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'branch_id'     => ['required', 'integer', Rule::exists('branches', 'branch_id')],
            'department_id' => 'required|integer|exists:departments,department_id',
            'name'          => 'required|string|max:200',
            'code'          => 'nullable|string|max:100',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $branchId = $this->integer('branch_id');
            $departmentId = $this->integer('department_id');

            if (! $branchId || ! $departmentId) {
                return;
            }

            $matchesBranch = Department::query()
                ->where('department_id', $departmentId)
                ->where('branch_id', $branchId)
                ->exists();

            if (! $matchesBranch) {
                $validator->errors()->add('department_id', 'Selected department does not belong to the selected branch.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'branch_id.required'     => 'Branch is required.',
            'branch_id.integer'      => 'Branch ID must be an integer.',
            'branch_id.exists'       => 'Selected branch does not exist.',

            'department_id.required' => 'Department is required.',
            'department_id.integer'  => 'Department ID must be an integer.',
            'department_id.exists'   => 'Selected department does not exist.',

            'name.required'          => 'Course name is required.',
            'name.string'            => 'Course name must be a valid string.',
            'name.max'               => 'Course name may not be greater than 200 characters.',

            'code.string'            => 'Code must be a valid string.',
            'code.max'               => 'Code may not be greater than 100 characters.',
        ];
    }
}
