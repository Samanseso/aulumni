<?php

namespace App\Exports;

use App\Exports\Sheets\MetricSheet;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ReportsExport implements WithMultipleSheets
{
    public function __construct(
        protected array $overview,
        protected array $insights,
        protected array $charts,
    ) {
    }

    public function sheets(): array
    {
        $sheets = [
            new MetricSheet(
                'Overview',
                ['Metric', 'Value', 'Notes'],
                collect($this->overview)
                    ->map(fn (array $item) => [
                        'Metric' => $item['label'] ?? '',
                        'Value' => $item['value'] ?? '',
                        'Notes' => $item['helper'] ?? '',
                    ])
                    ->all()
            ),
            new MetricSheet(
                'Insights',
                ['Insight', 'Value', 'Description', 'Tone'],
                collect($this->insights)
                    ->map(fn (array $item) => [
                        'Insight' => $item['title'] ?? '',
                        'Value' => $item['value'] ?? '',
                        'Description' => $item['description'] ?? '',
                        'Tone' => $item['tone'] ?? '',
                    ])
                    ->all()
            ),
        ];

        foreach ($this->charts as $chart) {
            $rows = collect($chart['data'] ?? [])
                ->map(fn (array $row) => collect($row)
                    ->mapWithKeys(fn ($value, $key) => [Str::headline((string) $key) => $value])
                    ->all())
                ->values();

            $headings = array_keys($rows->first() ?? []);

            if ($headings === []) {
                $headings = ['Message'];
                $rows = collect([
                    ['Message' => 'No chart data available for this report yet.'],
                ]);
            }

            $sheets[] = new MetricSheet(
                $chart['title'] ?? 'Report',
                $headings,
                $rows->all(),
            );
        }

        return $sheets;
    }
}
