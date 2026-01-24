<?php

namespace App\Http\Requests\CreateAlumni;

use Illuminate\Foundation\Http\FormRequest;

class EmploymentDetailsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
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
        return [
            'first_work_time_taken.in' => 'Invalid selection for time taken to get first job.',
            'first_work_acquisition.in' => 'Invalid selection for acquisition method.',
            'current_work_years.in' => 'Invalid selection for years in company.',
            //'current_work_monthly_income.in' => 'Invalid selection for monthly income.',
            'au_usefulness.in' => 'Invalid selection for usefulness.',
        ];
    }
}
