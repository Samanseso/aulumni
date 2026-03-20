<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $departmentId = $this->route('department')?->department_id;
        $branchId = $this->integer('branch_id');

        return [
            'branch_id'    => ['required', 'integer', Rule::exists('branches', 'branch_id')],
            'name'         => [
                'required',
                'string',
                'max:200',
                Rule::unique('departments', 'name')
                    ->where(fn ($query) => $query->where('branch_id', $branchId))
                    ->ignore($departmentId, 'department_id'),
            ],
            'description'  => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'branch_id.required' => 'Branch is required.',
            'branch_id.integer'  => 'Branch must be a valid branch.',
            'branch_id.exists'   => 'Selected branch does not exist.',

            'name.required' => 'Department name is required.',
            'name.string'   => 'Department name must be a valid string.',
            'name.max'      => 'Department name may not be greater than 200 characters.',
            'name.unique'   => 'Department name already exists for the selected branch.',

            'description.string' => 'Description must be a valid string.',
        ];
    }
}
