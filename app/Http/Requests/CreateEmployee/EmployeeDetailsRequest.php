<?php

namespace App\Http\Requests\CreateEmployee;

use Illuminate\Foundation\Http\FormRequest;

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
            'contact'     => ['required', 'string', 'max:50'],
            'branch'      => ['required', 'string', 'max:255'],
            'department'  => ['required', 'string', 'max:255'],
        ];
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

            'contact.required'     => 'Contact is required.',
            'contact.string'       => 'Contact must be a string.',
            'contact.max'          => 'Contact may not be greater than 50 characters.',

            'branch.required'      => 'Branch is required.',
            'branch.string'        => 'Branch must be a string.',
            'branch.max'           => 'Branch may not be greater than 255 characters.',

            'department.required'  => 'Department is required.',
            'department.string'    => 'Department must be a string.',
            'department.max'       => 'Department may not be greater than 255 characters.',
        ];
    }
}
