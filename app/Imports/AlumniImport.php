<?php

namespace App\Imports;

use App\Actions\Fortify\CreateNewUser;
use App\Models\Alumni;
use App\Models\AlumniPersonalDetails;
use App\Models\AlumniAcademicDetails;
use App\Models\AlumniContactDetails;
use App\Models\AlumniEmploymentDetails;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class AlumniImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
    
            $userName                   = $row['user_name'] ?? null;
            $alumniId                   = $row['alumni_id'] ?? null;
            $firstName                  = $row['first_name'] ?? null;
            $middleName                 = $row['middle_name'] ?? null;
            $lastName                   = $row['last_name'] ?? null;
            $photo                      = $row['photo'] ?? null;
            $gender                     = $row['gender'] ?? null;
            $birthday                   = $row['birthday'] ?? null;
            $bio                        = $row['bio'] ?? null;
            $interest                   = $row['interest'] ?? null;
            $branch                     = $row['branch'] ?? null;
            $address                    = $row['address'] ?? null;

            $studentNumber              = $row['student_number'] ?? null;
            $schoolLevel                = $row['school_level'] ?? null;
            $batch                      = $row['batch'] ?? null;
            $course                     = $row['course'] ?? null;

            $email                      = $row['email'] ?? null;
            $contact                    = $row['contact'] ?? null;
            $telephone                  = $row['telephone'] ?? null;
            $mailingAddress             = $row['mailing_address'] ?? null;
            $presentAddress             = $row['present_address'] ?? null;
            $provincialAddress          = $row['provincial_address'] ?? null;
            $companyAddress             = $row['company_address'] ?? null;
            $facebookUrl                = $row['facebook_url'] ?? null;
            $twitterUrl                 = $row['twitter_url'] ?? null;
            $gmailUrl                   = $row['gmail_url'] ?? null;
            $linkUrl                    = $row['link_url'] ?? null;
            $otherUrl                   = $row['other_url'] ?? null;

            $firstWorkPosition          = $row['first_work_position'] ?? null;
            $firstWorkTimeTaken         = $row['first_work_time_taken'] ?? null;
            $firstWorkAcquisition       = $row['first_work_acquisition'] ?? null;
            $currentEmployed            = $row['current_employed'] ?? null;
            $currentWorkType            = $row['current_work_type'] ?? null;
            $currentWorkStatus          = $row['current_work_status'] ?? null;
            $currentWorkCompany         = $row['company'] ?? null;
            $currentWorkPosition        = $row['position'] ?? null;
            $currentWorkYears           = $row['employee_year'] ?? null;
            $currentWorkMonthlyIncome   = $row['monthly_income'] ?? null;
            $currentWorkSatisfaction    = $row['satisfaction'] ?? null;
            $auSkills                   = $row['au_skills'] ?? null;
            $auUsefulness               = $row['au_usefulness'] ?? null;

            $password                   = $row['password'] ?? null;
            $status                     = $row['status'] ?? null;

            // Create the user account
            $user = app(CreateNewUser::class)->create([
                'user_name'             => $userName,
                'name'                  => ($firstName . ' ' . $lastName) ?: 'No Name',
                'email'                 => $email,
                'user_type'             => 'alumni',
                'password'              => $password,
                'password_confirmation' => $password,
                'status'                => $status,
                'created_by'            => Auth::user()->user_id,
            ]);

            // 1. Create alumni record
            $alumni = Alumni::updateOrCreate(
                [
                    'alumni_id' => $alumniId,
                    'user_id'   => $user->user_id,
                ],
            );

            // 2. Personal details
            AlumniPersonalDetails::updateOrCreate(
                ['alumni_id' => $alumni->alumni_id],
                [
                    'first_name'  => $firstName,
                    'middle_name' => $middleName,
                    'last_name'   => $lastName,
                    'photo'       => $photo,
                    'gender'      => $gender,
                    'birthday'    => $birthday,
                    'bio'         => $bio,
                    'interest'    => $interest,
                    'branch'      => $branch,
                    'address'     => $address,
                ]
            );

            // 3. Academic details
            AlumniAcademicDetails::updateOrCreate(
                ['alumni_id' => $alumni->alumni_id],
                [
                    'student_number' => $studentNumber,
                    'school_level'   => $schoolLevel,
                    'batch'          => $batch,
                    'branch'         => $branch,
                    'course'         => $course,
                ]
            );

            // 4. Contact details
            AlumniContactDetails::updateOrCreate(
                ['alumni_id' => $alumni->alumni_id],
                [
                    'email'               => $email,
                    'contact'             => $contact,
                    'telephone'           => $telephone,
                    'mailing_address'     => $mailingAddress,
                    'present_address'     => $presentAddress,
                    'provincial_address'  => $provincialAddress,
                    'company_address'     => $companyAddress,
                    'facebook_url'        => $facebookUrl,
                    'twitter_url'         => $twitterUrl,
                    'gmail_url'           => $gmailUrl,
                    'link_url'            => $linkUrl,
                    'other_url'           => $otherUrl,
                ]
            );

            // 5. Employment details
            AlumniEmploymentDetails::updateOrCreate(
                ['alumni_id' => $alumni->alumni_id],
                [
                    'first_work_position'        => $firstWorkPosition,
                    'first_work_time_taken'      => $firstWorkTimeTaken,
                    'first_work_acquisition'     => $firstWorkAcquisition,
                    'current_employed'           => $currentEmployed,
                    'current_work_type'          => $currentWorkType,
                    'current_work_status'        => $currentWorkStatus,
                    'current_work_company'       => $currentWorkCompany,
                    'current_work_position'      => $currentWorkPosition,
                    'current_work_years'         => $currentWorkYears,
                    'current_work_monthly_income'=> $currentWorkMonthlyIncome,
                    'current_work_satisfaction'  => $currentWorkSatisfaction,
                    'au_skills'                  => $auSkills,
                    'au_usefulness'              => $auUsefulness,
                ]
            );
        }
    }
}
