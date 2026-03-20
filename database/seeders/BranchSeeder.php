<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Seed branch records from the legacy dataset.
     */
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Juan Sumulong',
                'address' => 'Manila',
                'contact' => '8-734-7371 to 79',
            ],
            [
                'name' => 'Andres Bonifacio',
                'address' => 'Pasig',
                'contact' => '8-404-1644 | 8-641-4203 | 8-579-7295 | 8-579-7296',
            ],
            [
                'name' => 'Apolinario Mabini',
                'address' => 'Pasay',
                'contact' => '8-524-2850',
            ],
            [
                'name' => 'Elisa Esguerra',
                'address' => 'Malabon',
                'contact' => '8-932-5209',
            ],
            [
                'name' => 'Jose Abad Santos',
                'address' => 'Pasay',
                'contact' => '8-831-8077 | 8-804-0974 | 8-832-5525',
            ],
            [
                'name' => 'Jose Rizal',
                'address' => 'Malabon',
                'contact' => '8-921-2744 | 8-281-0025 | 8-579-7289 | 8-921-0386',
            ],
            [
                'name' => 'Plaridel',
                'address' => 'Mandaluyong',
                'contact' => '8-532-7741 | 8-531-4388',
            ],
            [
                'name' => 'School of Law',
                'address' => 'Pasay',
                'contact' => '(632) 8404-3089 to 93',
            ],
        ];

        foreach ($branches as $branch) {
            Branch::query()->updateOrCreate(
                ['name' => $branch['name']],
                [
                    'address' => $branch['address'],
                    'contact' => $branch['contact'],
                ]
            );
        }
    }
}
