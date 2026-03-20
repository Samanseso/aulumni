<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $branchId = $this->route('branch')?->branch_id;

        return [
            'name'    => ['required', 'string', 'max:255', Rule::unique('branches', 'name')->ignore($branchId, 'branch_id')],
            'address' => ['required', 'string', 'max:500'],
            'contact' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'    => 'Branch name is required.',
            'name.string'      => 'Branch name must be a valid string.',
            'name.max'         => 'Branch name may not be greater than 255 characters.',
            'name.unique'      => 'Branch name already exists.',

            'address.required' => 'Branch address is required.',
            'address.string'   => 'Branch address must be a valid string.',
            'address.max'      => 'Branch address may not be greater than 500 characters.',

            'contact.string'   => 'Contact must be a valid string.',
            'contact.max'      => 'Contact may not be greater than 500 characters.',
        ];
    }
}
