<?php

namespace Database\Seeders;

use App\Models\Batch;
use Illuminate\Database\Seeder;

class BatchSeeder extends Seeder
{
    /**
     * Seed the application's batch records from the legacy dataset.
     */
    public function run(): void
    {
        $batches = [
            [
                'year' => '2019',
                'name' => 'Masipag',
            ],
        ];

        foreach ($batches as $batch) {
            Batch::query()->updateOrCreate(
                ['year' => $batch['year']],
                ['name' => $batch['name']]
            );
        }
    }
}
