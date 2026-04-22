<?php

namespace App\Exports;

use App\Models\Alumni;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Database\Eloquent\Builder;

class AlumniExport implements FromQuery, WithHeadings, WithMapping, WithChunkReading, ShouldAutoSize
{
    public function chunkSize(): int
    {
        return 500;
    }

    public function query(): Builder
    {
        return Alumni::query()->with([
            'user:user_id,user_name,password,status',
            'personal_details:alumni_id,first_name,middle_name,last_name,gender,birthday,photo,bio,interest,address',
            'academic_details:alumni_id,student_number,school_level,batch,branch,course',
            'contact_details:alumni_id,email,contact,telephone,mailing_address,present_address,provincial_address,company_address,facebook_url,twitter_url,gmail_url,link_url,other_url',
            'employment_details:alumni_id,first_work_position,first_work_time_taken,first_work_acquisition,current_employed,current_work_type,current_work_status,current_work_company,current_work_position,current_work_years,current_work_monthly_income,current_work_satisfaction,au_skills,au_usefulness',
        ]);
    }

    public function headings(): array
    {
        return array_keys(self::columnMap());
    }

    public function map($alumni): array
    {
        $user       = $alumni->user;
        $personal   = $alumni->personal_details;
        $academic   = $alumni->academic_details;
        $contact    = $alumni->contact_details;
        $employment = $alumni->employment_details;

        return array_values(self::columnMap($user, $personal, $academic, $contact, $employment, $alumni));
    }

    // ------------------------------------------------------------------
    // Single source of truth: heading => value
    // Column names mirror AlumniImport exactly.
    // ------------------------------------------------------------------

    private static function columnMap(
        $user = null,
        $personal = null,
        $academic = null,
        $contact = null,
        $employment = null,
        $alumni = null,
    ): array {
        return [
            // identity (not re-imported, but useful for reference)
            'user_id'       => $user?->user_id,
            'user_name'     => $user?->user_name,
            'alumni_id'     => $alumni?->alumni_id,
            'status'        => $user?->status,

            // personal — matches import keys
            'first_name'    => $personal?->first_name,
            'middle_name'   => $personal?->middle_name,
            'last_name'     => $personal?->last_name,
            'sex'           => $personal?->gender,
            'birthday'      => $personal?->birthday,
            'photo'         => $personal?->photo,
            'bio'           => $personal?->bio,
            'interest'      => $personal?->interest,
            'address'       => $personal?->address,

            // academic — matches import keys
            'student_number' => $academic?->student_number,
            'school_level'   => $academic?->school_level,
            'year_graduated' => $academic?->batch,
            'branch'         => $academic?->branch,
            'degree_earned'  => $academic?->course,

            // contact — matches import keys
            'email_address'                => $contact?->email,
            'contact_number'               => $contact?->contact,
            'telephone'                    => $contact?->telephone,
            'mailing_address'              => $contact?->mailing_address,
            'where_are_you_based_right_now'=> $contact?->present_address,
            'provincial_address'           => $contact?->provincial_address,
            'company_address'              => $contact?->company_address,
            'facebook_account'             => $contact?->facebook_url,
            'twitter_url'                  => $contact?->twitter_url,
            'gmail_url'                    => $contact?->gmail_url,
            'link_url'                     => $contact?->link_url,
            'other_url'                    => $contact?->other_url,

            // employment — matches import keys
            'what_was_your_first_job_after_graduation'                                                                                                                               => $employment?->first_work_position,
            'how_long_did_it_take_for_you_to_get_this_job'                                                                                                                           => $employment?->first_work_time_taken,
            'how_did_you_acquire_your_current_job'                                                                                                                                   => $employment?->first_work_acquisition,
            'are_you_currently_employed_in_case_of_unemployed_state_your_reasons_why_you_are_unemployed_in_the_option_other'                                                         => $employment?->current_employed,
            'type_of_organization'                                                                                                                                                   => $employment?->current_work_type,
            'present_employment_status'                                                                                                                                              => $employment?->current_work_status,
            'name_of_present_employer_company'                                                                                                                                       => $employment?->current_work_company,
            'position'                                                                                                                                                               => $employment?->current_work_position,
            'number_of_years_in_the_company'                                                                                                                                         => $employment?->current_work_years,
            'monthly_income_range'                                                                                                                                                   => $employment?->current_work_monthly_income,
            'how_satisfied_are_you_with_your_job'                                                                                                                                    => $employment?->current_work_satisfaction,
            'what_do_you_think_are_the_skills_knowledge_and_trainings_you_received_from_arellano_university_that_proved_to_be_useful_to_your_current_job_business_further_studies'   => $employment?->au_skills,
            'to_what_extent_is_the_usefulness_of_these_acquired_knowledge_skills_and_trainings'                                                                                      => $employment?->au_usefulness,
        ];
    }
}