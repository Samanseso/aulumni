<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'event_type' => ['required', Rule::in(['Seminar', 'Workshop', 'Webinar', 'Career Fair', 'Alumni Gathering', 'General Event'])],
            'organizer' => ['nullable', 'string', 'max:255'],
            'venue' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'description' => ['required', 'string'],
            'privacy' => ['nullable', Rule::in(['public', 'friends', 'only_me'])],
            'attachments' => ['nullable'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,gif,webp,mp4,mov,pdf,doc,docx', 'max:10240'],
        ];
    }
}
