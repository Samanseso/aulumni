<?php

namespace App\Http\Requests\CreateAlumni;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAlumniRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $currentYear = date('Y');

        return [
            // User details
            'name'       => ['required', 'string', 'max:100'],
            'user_name'  => ['required', 'string', 'max:100'],

            // Personal details
            'first_name'  => ['required', 'string', 'max:50'],
            'middle_name' => ['required', 'string', 'max:50'],
            'last_name'   => ['required', 'string', 'max:50'],
            'birthday'    => ['required', 'date'],
            'gender'      => ['required', 'in:Male,Female,Other'],
            'photo'       => ['nullable', 'string'],
            'bio'         => ['nullable', 'string', 'max:2000'],
            'interest'    => ['nullable', 'string', 'max:1000'],
            'address'     => ['nullable', 'string', 'max:2000'],

            // Academic details
            'student_number' => ['required', 'string', 'max:100'],
            'school_level'   => ['required', 'in:Elementary,High School,College,Graduate'],
            'batch'          => ['required', 'digits:4', 'integer', "between:1900,{$currentYear}"],
            'campus'         => ['required', 'string', 'max:255'],
            'course'         => ['required', 'string', 'max:100'],

            // Contact details
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

            // Employment details
            'first_work_position'            => ['nullable', 'string', 'max:255'],
            'first_work_time_taken'          => ['nullable', 'in:Less than a month,1 - 6 months,7 - 11 months,1 yr. to less than 2 yrs.,2 yrs. to less than 3 yrs.,3 yrs. to less than 4 yrs.,More than 4 yrs.'],
            'first_work_acquisition'         => ['nullable', 'in:Personally applied for the job,Arranged by school\'s job placement,Recommended by AU faculty/dean,Directly invited by the company,Other'],
            'current_employed'               => ['nullable', 'in:Yes,No,Self employed,Managing own company / business,Retired,Never employed,Other'],
            'current_work_type'              => ['nullable', 'in:Private,Public,NGO,Other'],
            'current_work_status'            => ['nullable', 'in:Regular/Permanent,Casual,Part Time,Contractual'],
            'current_work_company'           => ['nullable', 'string', 'max:255'],
            'current_work_position'          => ['nullable', 'string', 'max:255'],
            'current_work_years'             => ['nullable', 'in:1 - 5,6 - 10,11 - 15,16 - 20,21 - 25,25 above'],
            'current_work_monthly_income'    => ['nullable'],
            'current_work_satisfaction'      => ['nullable', 'in:Very satisfied,Satisfied,Dissatisfied,Very dissatisfied'],
            'au_skills'                      => ['nullable', 'string', 'max:4000'],
            'au_usefulness'                  => ['nullable', 'in:Very useful,Moderately useful,Occasionally useful,Not at all useful'],
        ];
    }

    public function messages(): array
    {
        $currentYear = date('Y');

        return [
            // New fields
            'name.required'      => 'Name is required.',
            'user_name.required' => 'Username is required.',

            // Personal details
            'first_name.required' => 'First name is required.',
            'middle_name.required'=> 'Middle name is required.',
            'last_name.required'  => 'Last name is required.',
            'birthday.required'   => 'Birthday is required.',
            'first_name.max'      => 'First name may not be greater than 50 characters.',
            'middle_name.max'     => 'Middle name may not be greater than 50 characters.',
            'last_name.max'       => 'Last name may not be greater than 50 characters.',
            'gender.in'           => 'Gender must be Male, Female, or Other.',
            'birthday.date'       => 'Birthday must be a valid date.',

            // Academic details
            'student_number.required' => 'Student number is required.',
            'student_number.string'   => 'Student number must be a string.',
            'student_number.max'      => 'Student number may not be greater than 100 characters.',
            'school_level.required'   => 'School level is required.',
            'school_level.in'         => 'School level must be Elementary, High School, College, or Graduate.',
            'batch.required'          => 'Batch is required.',
            'batch.digits'            => 'Batch must be a four digit year (e.g., 2020).',
            'batch.integer'           => 'Batch must be a valid year.',
            'batch.between'           => "Batch must be between 1900 and {$currentYear}.",
            'campus.required'         => 'Campus is required.',
            'campus.string'           => 'Campus must be a string.',
            'campus.max'              => 'Campus may not be greater than 255 characters.',
            'course.required'         => 'Course is required.',
            'course.string'           => 'Course must be a string.',
            'course.max'              => 'Course may not be greater than 100 characters.',

            // Contact details
            'email.email'        => 'Please provide a valid email address.',
            'contact.max'        => 'Contact number may not be greater than 11 characters.',
            'facebook_url.url'   => 'Facebook URL must be a valid URL.',
            'twitter_url.url'    => 'Twitter URL must be a valid URL.',

            // Employment details
            'first_work_time_taken.in' => 'Invalid selection for time taken to get first job.',
            'first_work_acquisition.in' => 'Invalid selection for acquisition method.',
            'current_work_years.in' => 'Invalid selection for years in company.',
            'au_usefulness.in' => 'Invalid selection for usefulness.',
        ];
    }
}
