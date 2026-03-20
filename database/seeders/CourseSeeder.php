<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Seed branch-aware course records from the legacy main-branch dataset.
     */
    public function run(): void
    {
        $courseCatalog = [
            'BSCS' => [
                'name' => 'Bachelor of Science in Computer Science',
                'department' => 'School of Computer Studies',
            ],
            'BSIT' => [
                'name' => 'Bachelor of Science in Information Technology',
                'department' => 'Information Technology Education (ITE) Cluster',
            ],
            'BSIS' => [
                'name' => 'Bachelor of Science in Information Systems',
                'department' => 'School of Computer Studies',
            ],
            'BSMT' => [
                'name' => 'Bachelor of Science in Medical Technology',
                'department' => 'College of Medical Laboratory Science',
            ],
            'BSN' => [
                'name' => 'Bachelor of Science in Nursing',
                'department' => 'College of Nursing',
            ],
            'BSP' => [
                'name' => 'Bachelor of Science in Pharmacy',
                'department' => 'College of Pharmacy',
            ],
            'BSCrim' => [
                'name' => 'Bachelor of Science in Criminology',
                'department' => 'College of Criminal Justice Education',
            ],
            'BSPT' => [
                'name' => 'Bachelor of Science in Physical Therapy',
                'department' => 'College of Physical Therapy',
            ],
            'BSRT' => [
                'name' => 'Bachelor of Science in Radiologic Technology',
                'department' => 'College of Radiologic Technology',
            ],
            'BSBA' => [
                'name' => 'Bachelor of Science in Business Administration',
                'department' => 'School of Business Administration',
            ],
            'BSHM' => [
                'name' => 'Bachelor of Science in Hospitality Management',
                'department' => 'School of Hospitality and Tourism Management',
            ],
            'BSMidw' => [
                'name' => 'Bachelor of Science in Midwifery',
                'department' => 'School of Midwifery',
            ],
        ];

        $branchCourses = [
            'Juan Sumulong' => array_keys($courseCatalog),
            'Andres Bonifacio' => [
                'BSCrim',
                'BSN',
                'BSIT',
                'BSCS',
                'BSBA',
            ],
            'Apolinario Mabini' => [
                'BSMT',
                'BSN',
                'BSP',
                'BSPT',
                'BSRT',
            ],
            'Elisa Esguerra' => [
                'BSIT',
                'BSBA',
                'BSHM',
            ],
            'Jose Abad Santos' => [
                'BSCrim',
                'BSIT',
                'BSBA',
            ],
            'Jose Rizal' => [
                'BSN',
                'BSP',
                'BSMidw',
            ],
            'Plaridel' => [
                'BSIT',
                'BSCS',
                'BSIS',
                'BSBA',
            ],
            'School of Law' => [],
        ];

        foreach ($branchCourses as $branchName => $courseCodes) {
            $branch = Branch::query()
                ->where('name', $branchName)
                ->firstOrFail();

            foreach ($courseCodes as $courseCode) {
                $course = $courseCatalog[$courseCode];

                $department = Department::query()
                    ->where('branch_id', $branch->branch_id)
                    ->where('name', $course['department'])
                    ->firstOrFail();

                Course::query()->updateOrCreate(
                    [
                        'branch_id' => $branch->branch_id,
                        'department_id' => $department->department_id,
                        'code' => $courseCode,
                    ],
                    [
                        'name' => $course['name'],
                    ]
                );
            }
        }
    }
}
