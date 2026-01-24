<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'    => 'required|string|max:200',
            'address' => 'required|string|max:200',
            'contact' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'    => 'Branch name is required.',
            'name.string'      => 'Branch name must be a valid string.',
            'name.max'         => 'Branch name may not be greater than 200 characters.',

            'address.required' => 'Branch address is required.',
            'address.string'   => 'Branch address must be a valid string.',
            'address.max'      => 'Branch address may not be greater than 200 characters.',

            'contact.string'   => 'Contact must be a valid string.',
            'contact.max'      => 'Contact may not be greater than 255 characters.',
        ];
    }
}
