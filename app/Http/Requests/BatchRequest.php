<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $currentYear = (int) date('Y') + 10;
        $batchYear = $this->route('batch')?->year;

        return [
            'year' => [
                'required',
                'digits:4',
                'integer',
                "between:1900,{$currentYear}",
                Rule::unique('batch', 'year')->ignore($batchYear, 'year'),
            ],
            'name' => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        $currentYear = (int) date('Y') + 10;

        return [
            'year.required' => 'Batch year is required.',
            'year.digits' => 'Batch year must be a four-digit year.',
            'year.integer' => 'Batch year must be a valid year.',
            'year.between' => "Batch year must be between 1900 and {$currentYear}.",
            'year.unique' => 'Batch year already exists.',
            'name.required' => 'Batch name is required.',
            'name.string' => 'Batch name must be a valid string.',
            'name.max' => 'Batch name may not be greater than 100 characters.',
        ];
    }
}
