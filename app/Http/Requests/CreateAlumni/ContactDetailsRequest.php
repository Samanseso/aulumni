<?php

namespace App\Http\Requests\CreateAlumni;

use Illuminate\Foundation\Http\FormRequest;

class ContactDetailsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'             => ['nullable', 'email', 'max:255'],
            'contact'           => ['nullable', 'string', 'max:11'],
            'mailing_address'   => ['nullable', 'string', 'max:2000'],
            'present_address'   => ['nullable', 'string', 'max:2000'],
            'provincial_address'=> ['nullable', 'string', 'max:2000'],
            'facebook_url'      => ['nullable', 'url', 'max:1000'],
            'twitter_url'       => ['nullable', 'url', 'max:1000'],
            'gmail_url'         => ['nullable', 'url', 'max:1000'],
            'link_url'          => ['nullable', 'url', 'max:1000'],
            'other_url'         => ['nullable', 'url', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email'        => 'Please provide a valid email address.',
            'contact.required'      => 'Contact number is required.',
            'contact.max'           => 'Contact number may not be greater than 11 characters.',
            'facebook_url.url'   => 'Facebook URL must be a valid URL.',
            'twitter_url.url'    => 'Twitter URL must be a valid URL.',
        ];
    }
}
