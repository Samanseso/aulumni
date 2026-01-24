<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:200',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Department name is required.',
            'name.string'   => 'Department name must be a valid string.',
            'name.max'      => 'Department name may not be greater than 200 characters.',

            'description.string' => 'Description must be a valid string.',
        ];
    }
}
