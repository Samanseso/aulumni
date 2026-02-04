<?php

namespace App\Exports;

use App\Models\Alumni;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AlumniExport implements FromCollection, WithHeadings
{
    public function collection(): Collection
    {
        return Alumni::with([
            'user',
            'personal_details',
            'academic_details',
            'contact_details',
            'employment_details',
        ])->get()->map(function ($alumni) {
            return [
                // USER
                'user_id'               => optional($alumni->user)->user_id,
                'user_name'             => optional($alumni->user)->user_name,

                // PERSONAL
                'alumni_id'             => $alumni->alumni_id,
                'first_name'            => optional($alumni->personal_details)->first_name,
                'middle_name'           => optional($alumni->personal_details)->middle_name,
                'last_name'             => optional($alumni->personal_details)->last_name,
                'password'              => optional($alumni->user)->password,
                'status'                => optional($alumni->user)->status,
                'gender'                => optional($alumni->personal_details)->gender,
                'birthday'              => optional($alumni->personal_details)->birthday,
                'photo'                 => optional($alumni->personal_details)->photo,
                'bio'                   => optional($alumni->personal_details)->bio,
                'interest'              => optional($alumni->personal_details)->interest,
                'address'               => optional($alumni->personal_details)->address,

                // ACADEMIC
                'student_number'        => optional($alumni->academic_details)->student_number,
                'school_level'          => optional($alumni->academic_details)->school_level,
                'batch'                 => optional($alumni->academic_details)->batch,
                'branch'                => optional($alumni->academic_details)->branch,
                'course'                => optional($alumni->academic_details)->course,

                // CONTACT
                'email'                 => optional($alumni->contact_details)->email,
                'contact'               => optional($alumni->contact_details)->contact,
                'telephone'             => optional($alumni->contact_details)->telephone,
                'mailing_address'       => optional($alumni->contact_details)->mailing_address,
                'present_address'       => optional($alumni->contact_details)->present_address,
                'provincial_address'    => optional($alumni->contact_details)->provincial_address,
                'company_address'       => optional($alumni->contact_details)->company_address,
                'facebook_url'          => optional($alumni->contact_details)->facebook_url,
                'twitter_url'           => optional($alumni->contact_details)->twitter_url,
                'gmail_url'             => optional($alumni->contact_details)->gmail_url,
                'link_url'              => optional($alumni->contact_details)->link_url,
                'other_url'             => optional($alumni->contact_details)->other_url,

                // EMPLOYMENT
                'first_work_position'   => optional($alumni->employment_details)->first_work_position,
                'first_work_time_taken' => optional($alumni->employment_details)->first_work_time_taken,
                'first_work_acquisition' => optional($alumni->employment_details)->first_work_acquisition,
                'current_employed'      => optional($alumni->employment_details)->current_employed,
                'current_work_type'     => optional($alumni->employment_details)->current_work_type,
                'current_work_status'   => optional($alumni->employment_details)->current_work_status,
                'company'               => optional($alumni->employment_details)->current_work_company,
                'position'              => optional($alumni->employment_details)->current_work_position,
                'employee_year'         => optional($alumni->employment_details)->current_work_years,
                'monthly_income'        => optional($alumni->employment_details)->current_work_monthly_income,
                'satisfaction'          => optional($alumni->employment_details)->current_work_satisfaction,
                'au_skills'             => optional($alumni->employment_details)->au_skills,
                'au_usefulness'         => optional($alumni->employment_details)->au_usefulness,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'user_id',
            'user_name',
            'alumni_id',
            'first_name',
            'middle_name',
            'last_name',
            'password',
            'status',
            'gender',
            'birthday',
            'photo',
            'bio',
            'interest',
            'address',
            'student_number',
            'school_level',
            'batch',
            'branch',
            'course',
            'email',
            'contact',
            'telephone',
            'mailing_address',
            'present_address',
            'provincial_address',
            'company_address',
            'facebook_url',
            'twitter_url',
            'gmail_url',
            'link_url',
            'other_url',
            'first_work_position',
            'first_work_time_taken',
            'first_work_acquisition',
            'current_employed',
            'current_work_type',
            'current_work_status',
            'company',
            'position',
            'employee_year',
            'monthly_income',
            'satisfaction',
            'au_skills',
            'au_usefulness',
        ];
    }
}
