<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'job_title' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'job_type' => ['required', Rule::in(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'])],
            'salary' => ['nullable', 'string', 'max:100'],
            'job_description' => ['required', 'string'],
            'privacy' => ['nullable', Rule::in(['public', 'friends', 'only_me'])],
            'status' => ['nullable', 'string', 'max:50'],
            'attachments' => ['nullable'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,gif,webp,mp4,mov,pdf,doc,docx', 'max:10240'],
        ];
    }
}
