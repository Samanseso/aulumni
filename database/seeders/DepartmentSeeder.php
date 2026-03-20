<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Seed the branch-aware department hierarchy.
     *
     * The legacy dump only covered the main branch, so we seed the full set
     * under Juan Sumulong and reuse selected departments for other branches.
     */
    public function run(): void
    {
        $departmentCatalog = [
            'College of Arts and Sciences' => 'Liberal Arts and general education programs',
            'College of Criminal Justice Education' => 'Criminology and criminal justice programs',
            'College of Medical Laboratory Science' => 'Medical Technology / Medical Laboratory Science programs',
            'College of Nursing' => 'Nursing programs',
            'College of Pharmacy' => 'Pharmacy programs',
            'College of Physical Therapy' => 'Physical Therapy programs',
            'College of Radiologic Technology' => 'Radiologic Technology programs',
            'Information Technology Education (ITE) Cluster' => 'Computing and IT programs',
            'Institute of Accountancy' => 'Accounting programs',
            'School of Business Administration' => 'Business Administration majors',
            'School of Business and Commerce' => 'Business and commerce programs',
            'School of Business Technology' => 'Accounting Information Systems and related programs',
            'School of Computer Studies' => 'Computer and IT education',
            'School of Education' => 'Teacher education programs',
            'School of Hospitality and Tourism Management' => 'Hospitality and tourism programs',
            'School of Midwifery' => 'Midwifery programs',
            'School of Psychology' => 'Psychology programs',
        ];

        $branchDepartments = [
            'Juan Sumulong' => array_keys($departmentCatalog),
            'Andres Bonifacio' => [
                'College of Criminal Justice Education',
                'College of Nursing',
                'Information Technology Education (ITE) Cluster',
                'School of Business Administration',
                'School of Computer Studies',
            ],
            'Apolinario Mabini' => [
                'College of Medical Laboratory Science',
                'College of Nursing',
                'College of Pharmacy',
                'College of Physical Therapy',
                'College of Radiologic Technology',
            ],
            'Elisa Esguerra' => [
                'Information Technology Education (ITE) Cluster',
                'School of Business Administration',
                'School of Hospitality and Tourism Management',
            ],
            'Jose Abad Santos' => [
                'College of Arts and Sciences',
                'College of Criminal Justice Education',
                'Information Technology Education (ITE) Cluster',
                'School of Business Administration',
            ],
            'Jose Rizal' => [
                'College of Nursing',
                'College of Pharmacy',
                'School of Midwifery',
                'School of Psychology',
            ],
            'Plaridel' => [
                'Information Technology Education (ITE) Cluster',
                'Institute of Accountancy',
                'School of Business Administration',
                'School of Computer Studies',
                'School of Education',
            ],
            'School of Law' => [],
        ];

        foreach ($branchDepartments as $branchName => $departmentNames) {
            $branch = Branch::query()
                ->where('name', $branchName)
                ->firstOrFail();

            foreach ($departmentNames as $departmentName) {
                Department::query()->updateOrCreate(
                    [
                        'branch_id' => $branch->branch_id,
                        'name' => $departmentName,
                    ],
                    [
                        'description' => $departmentCatalog[$departmentName] ?? null,
                    ]
                );
            }
        }
    }
}
