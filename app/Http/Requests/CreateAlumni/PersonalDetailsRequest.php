<?php

namespace App\Http\Requests\CreateAlumni;

use Illuminate\Foundation\Http\FormRequest;

class PersonalDetailsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name'  => ['required', 'string', 'max:50'],
            'middle_name' => ['required', 'string', 'max:50'],
            'last_name'   => ['required', 'string', 'max:50'],
            'birthday'    => ['required', 'date'],
            'gender'      => ['required', 'in:Male,Female,Other'],
            'photo'       => ['nullable', 'string'],
            'bio'         => ['nullable', 'string', 'max:2000'],
            'interest'    => ['nullable', 'string', 'max:1000'],
            'address'     => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {   
        return [
            'first_name.required' => 'First name is required.',
            'middle_name.required'=> 'Middle name is required.',
            'last_name.required'  => 'Last name is required.',
            'birthday.required'   => 'Birthday is required.',
            'first_name.max'      => 'First name may not be greater than 50 characters.',
            'middle_name.max'     => 'Middle name may not be greater than 50 characters.',
            'last_name.max'       => 'Last name may not be greater than 50 characters.',
            'gender.in'           => 'Gender must be Male, Female, or Other.',
            'birthday.date'       => 'Birthday must be a valid date.',
        ];
    }
}
