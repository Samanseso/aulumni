<?php

namespace App\Http\Requests\CreateEmployee;

use App\Models\Department;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployeeDetailsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name'  => ['required', 'string', 'max:255'],
            'middle_name' => ['required', 'string', 'max:255'],
            'last_name'   => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'contact'     => ['required', 'string', 'max:50'],
            'branch_id'   => ['required', 'integer', Rule::exists('branches', 'branch_id')],
            'department_id' => ['required', 'integer', Rule::exists('departments', 'department_id')],
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
            'first_name.required'  => 'First name is required.',
            'first_name.string'    => 'First name must be a string.',
            'first_name.max'       => 'First name may not be greater than 255 characters.',

            'middle_name.required' => 'Middle name is required.',
            'middle_name.string'   => 'Middle name must be a string.',
            'middle_name.max'      => 'Middle name may not be greater than 255 characters.',

            'last_name.required'   => 'Last name is required.',
            'last_name.string'     => 'Last name must be a string.',
            'last_name.max'        => 'Last name may not be greater than 255 characters.',

            'email.required'       => 'Email is required.',
            'email.email'          => 'Email must be a valid email address.',
            'email.unique'         => 'Email is already in use.',

            'contact.required'     => 'Contact is required.',
            'contact.string'       => 'Contact must be a string.',
            'contact.max'          => 'Contact may not be greater than 50 characters.',

            'branch_id.required'   => 'Branch is required.',
            'branch_id.integer'    => 'Branch must be a valid branch.',
            'branch_id.exists'     => 'Selected branch does not exist.',

            'department_id.required' => 'Department is required.',
            'department_id.integer'  => 'Department must be a valid department.',
            'department_id.exists'   => 'Selected department does not exist.',
        ];
    }
}
