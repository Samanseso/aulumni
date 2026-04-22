<?php

namespace App\Support;

use App\Models\Alumni;
use App\Models\AlumniAcademicDetails;
use App\Models\AlumniContactDetails;
use App\Models\AlumniEmploymentDetails;
use App\Models\Post;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\CarbonInterface;

class AdminDashboardReportService
{
    public function build(): array
    {
        $monthlyActivity = $this->monthlyActivitySeries(6);
        $postPipeline = $this->monthlyPostPipelineSeries(6);
        $schoolLevels = $this->distribution('alumni_academic_details', 'school_level');
        $accountStatuses = $this->distributionForQuery(
            User::query()->where('user_type', 'alumni'),
            'status',
            ['active' => 'Active', 'pending' => 'Pending', 'inactive' => 'Inactive']
        );
        $employmentStatuses = $this->distribution('alumni_employment_details', 'current_employed');
        $branchPerformance = $this->branchPerformance();
        $topEmployers = $this->topEmployers();
        $workTypes = $this->distribution('alumni_employment_details', 'current_work_type');
        $accountStatusSlices = $this->attachSliceColors($accountStatuses, ['#014EA8', '#DA281C', '#78A8E3']);
        $employmentStatusSlices = $this->attachSliceColors($employmentStatuses, ['#DA281C', '#014EA8', '#F08D86', '#78A8E3', '#C9DBF5', '#F7C0BB']);

        $totalAlumni = Alumni::query()->count();
        $activeAlumni = User::query()->where('user_type', 'alumni')->where('status', 'active')->count();
        $employmentProfiles = AlumniEmploymentDetails::query()->whereNotNull('current_employed')->count();
        $contactCoverage = AlumniContactDetails::query()
            ->whereNotNull('contact')
            ->where('contact', '!=', '')
            ->count();
        $branchLeader = $branchPerformance->sortByDesc('alumni')->first();
        $employerLeader = $topEmployers->first();
        $pendingPosts = Post::query()->where('status', 'pending')->count();
        $employmentCoverage = $this->formatPercentage($employmentProfiles, $totalAlumni);

        $overview = [
            $this->overviewCard(
                id: 'alumni-employment-record',
                label: 'Alumni employment record',
                value: $this->formatRatio($employmentProfiles, $totalAlumni),
                helper: 'Employment records captured over the total alumni records in the platform.',
                trendLabel: $employmentCoverage . ' of alumni records already contain employment data',
                trendValue: $employmentCoverage,
                sparkline: $this->sparkline($monthlyActivity, 'employment_profiles', true),
            ),
            $this->overviewCard(
                id: 'active-accounts',
                label: 'Active alumni accounts',
                value: $activeAlumni,
                helper: 'Accounts currently marked active and ready to use the system.',
                trendLabel: $this->trendLabel($monthlyActivity, 'active_alumni'),
                trendValue: $totalAlumni > 0 ? round(($activeAlumni / $totalAlumni) * 100, 1) . '%' : '0%',
                sparkline: $this->sparkline($monthlyActivity, 'active_alumni', true),
            ),
            $this->overviewCard(
                id: 'pending-opportunities',
                label: 'Pending job posts',
                value: $pendingPosts,
                helper: 'Job opportunities still waiting for review before they go live.',
                trendLabel: $this->trendLabel($postPipeline, 'pending_posts'),
                trendValue: $this->trendValue($postPipeline, 'pending_posts'),
                sparkline: $this->sparkline($postPipeline, 'pending_posts'),
            ),
        ];

        $charts = [
            // [
            //     'id' => 'school-level-distribution',
            //     'title' => 'School level distribution',
            //     'description' => 'Highlights where the alumni population is concentrated by academic level.',
            //     'type' => 'bar',
            //     'x_key' => 'label',
            //     'series' => [
            //         ['key' => 'value', 'label' => 'Alumni', 'color' => '#014EA8'],
            //     ],
            //     'data' => $schoolLevels->values()->all(),
            //     'insight' => 'Useful for prioritizing programs and tracer-report segments by educational level.',
            // ],
            [
                'id' => 'account-status',
                'title' => 'Account status mix',
                'description' => 'Compares active, pending, and inactive alumni accounts in one glance.',
                'type' => 'pie',
                'name_key' => 'label',
                'value_key' => 'value',
                'series' => [
                    ['key' => 'value', 'label' => 'Accounts', 'color' => '#014EA8'],
                ],
                'data' => $accountStatusSlices->values()->all(),
                'insight' => 'Useful for activation campaigns and for monitoring whether inactive accounts are growing.',
            ],
            [
                'id' => 'employment-status',
                'title' => 'Employment status distribution',
                'description' => 'Summarizes current employment outcomes from alumni who already have tracer data.',
                'type' => 'pie',
                'name_key' => 'label',
                'value_key' => 'value',
                'series' => [
                    ['key' => 'value', 'label' => 'Alumni', 'color' => '#DA281C'],
                ],
                'data' => $employmentStatusSlices->values()->all(),
                'insight' => 'Useful for formal tracer-report summaries around employability and current work outcomes.',
            ],
            [
                'id' => 'content-pipeline',
                'title' => 'Job posting moderation pipeline',
                'description' => 'Tracks approved, pending, and rejected posts across the last six months.',
                'type' => 'line',
                'x_key' => 'month',
                'series' => [
                    ['key' => 'approved_posts', 'label' => 'Approved', 'color' => '#014EA8'],
                    ['key' => 'pending_posts', 'label' => 'Pending', 'color' => '#DA281C'],
                    ['key' => 'rejected_posts', 'label' => 'Rejected', 'color' => '#F08D86'],
                ],
                'data' => $postPipeline->values()->all(),
                'insight' => 'Useful for spotting moderation backlog and the pace of job-post approvals.',
            ],
            [
                'id' => 'branch-performance',
                'title' => 'Branch participation and employment',
                'description' => 'Compares top branches by total alumni records and employed alumni counts.',
                'type' => 'radar',
                'x_key' => 'branch',
                'series' => [
                    ['key' => 'alumni', 'label' => 'Alumni', 'color' => '#014EA8'],
                    ['key' => 'employed', 'label' => 'Employed', 'color' => '#DA281C'],
                ],
                'data' => $branchPerformance->values()->all(),
                'insight' => 'Useful for locating branches with strong alumni volume and stronger employment outcomes.',
            ],
            // [
            //     'id' => 'top-employers',
            //     'title' => 'Top current employers',
            //     'description' => 'Ranks the organizations where alumni most commonly report working today.',
            //     'type' => 'bar',
            //     'layout' => 'horizontal',
            //     'x_key' => 'label',
            //     'series' => [
            //         ['key' => 'value', 'label' => 'Alumni', 'color' => '#DA281C'],
            //     ],
            //     'data' => $topEmployers->values()->all(),
            //     'insight' => 'Useful for partnership leads, employer engagement, and showcasing alumni placement clusters.',
            // ],
            [
                'id' => 'work-type-mix',
                'title' => 'Current work type mix',
                'description' => 'Breaks down whether employed alumni work in private, public, NGO, or other sectors.',
                'type' => 'bar',
                'x_key' => 'label',
                'series' => [
                    ['key' => 'value', 'label' => 'Alumni', 'color' => '#DA281C'],
                ],
                'data' => $workTypes->values()->all(),
                'insight' => 'Useful for labor-market mapping and institutional reporting on industry placement.',
            ],
        ];

        $insights = [
            [
                'title' => 'Largest branch concentration',
                'value' => $branchLeader ? $branchLeader['branch'] : 'No branch data yet',
                'description' => $branchLeader
                    ? $branchLeader['alumni'] . ' alumni currently map to this branch.'
                    : 'Branch-level academic records have not been populated yet.',
                'tone' => 'blue',
            ],
            [
                'title' => 'Top current employer',
                'value' => $employerLeader ? $employerLeader['label'] : 'No employer data yet',
                'description' => $employerLeader
                    ? $employerLeader['value'] . ' alumni currently report this organization.'
                    : 'Current employer information has not been populated yet.',
                'tone' => 'red',
            ],
            [
                'title' => 'Contact data coverage',
                'value' => $totalAlumni > 0 ? round(($contactCoverage / $totalAlumni) * 100, 1) . '%' : '0%',
                'description' => 'Shows how much of the directory already has a usable contact number for outreach.',
                'tone' => 'blue',
            ],
            [
                'title' => 'Post approval backlog',
                'value' => $pendingPosts,
                'description' => 'Pending opportunities waiting for review before they become visible in the alumni feed.',
                'tone' => 'red',
            ],
        ];

        return [
            'generated_at' => now()->format('F j, Y g:i A'),
            'workbook_download_url' => route('dashboard.reports.export.workbook'),
            'overview' => $overview,
            'charts' => $charts,
            'insights' => $insights,
        ];
    }

    protected function overviewCard(
        string $id,
        string $label,
        string|int|float $value,
        string $helper,
        string $trendLabel,
        string $trendValue,
        array $sparkline,
    ): array {
        return [
            'id' => $id,
            'label' => $label,
            'value' => $value,
            'helper' => $helper,
            'trend_label' => $trendLabel,
            'trend_value' => $trendValue,
            'sparkline' => $sparkline,
        ];
    }

    protected function monthlyActivitySeries(int $months): Collection
    {
        return $this->recentMonths($months)->map(function (CarbonInterface $monthStart) {
            $monthEnd = $monthStart->copy()->endOfMonth();

            return [
                'month' => $monthStart->format('M'),
                'alumni' => Alumni::query()->whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'active_alumni' => User::query()
                    ->where('user_type', 'alumni')
                    ->where('status', 'active')
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
                'employment_profiles' => AlumniEmploymentDetails::query()
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
                'approved_posts' => Post::query()
                    ->where('status', 'approved')
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
            ];
        });
    }

    protected function monthlyPostPipelineSeries(int $months): Collection
    {
        return $this->recentMonths($months)->map(function (CarbonInterface $monthStart) {
            $monthEnd = $monthStart->copy()->endOfMonth();
            return [
                'month' => $monthStart->format('M'),
                'approved_posts' => Post::query()
                    ->where('status', 'approved')
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
                'pending_posts' => Post::query()
                    ->where('status', 'pending')
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
                'rejected_posts' => Post::query()
                    ->where('status', 'rejected')
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
            ];
        });
    }

    protected function recentMonths(int $months): Collection
    {
        return collect(range($months - 1, 0))
            ->map(fn(int $offset) => now()->copy()->startOfMonth()->subMonths($offset));
    }

    protected function distribution(string $table, string $field, ?array $map = null, int $limit = 8): Collection
    {
        return DB::table($table)
            ->selectRaw("COALESCE(NULLIF(TRIM({$field}), ''), 'Not specified') as label, COUNT(*) as value")
            ->groupBy('label')
            ->orderByDesc('value')
            ->limit($limit)
            ->get()
            ->map(fn($row) => [
                'label' => $map[(string) $row->label] ?? (string) $row->label,
                'value' => (int) $row->value,
            ]);
    }

    protected function distributionForQuery($query, string $field, ?array $map = null, int $limit = 8): Collection
    {
        return $query
            ->selectRaw("COALESCE(NULLIF(TRIM({$field}), ''), 'Not specified') as label, COUNT(*) as value")
            ->groupBy('label')
            ->orderByDesc('value')
            ->limit($limit)
            ->get()
            ->map(fn($row) => [
                'label' => $map[(string) $row->label] ?? (string) $row->label,
                'value' => (int) $row->value,
            ]);
    }

    protected function branchPerformance(): Collection
    {
        return DB::table('alumni_academic_details as academic')
            ->leftJoin('alumni_employment_details as employment', 'academic.alumni_id', '=', 'employment.alumni_id')
            ->selectRaw("COALESCE(NULLIF(TRIM(academic.branch), ''), 'Not specified') as branch")
            ->selectRaw('COUNT(*) as alumni')
            ->selectRaw("SUM(CASE WHEN employment.current_employed IS NOT NULL AND employment.current_employed NOT IN ('No', 'Never employed') THEN 1 ELSE 0 END) as employed")
            ->groupBy('branch')
            ->orderByDesc('alumni')
            ->limit(6)
            ->get()
            ->map(fn($row) => [
                'branch' => (string) $row->branch,
                'alumni' => (int) $row->alumni,
                'employed' => (int) $row->employed,
            ]);
    }

    protected function topEmployers(): Collection
    {
        return DB::table('alumni_employment_details')
            ->selectRaw("COALESCE(NULLIF(TRIM(current_work_company), ''), 'Not specified') as label, COUNT(*) as value")
            ->whereNotNull('current_work_company')
            ->where('current_work_company', '!=', '')
            ->groupBy('label')
            ->orderByDesc('value')
            ->limit(6)
            ->get()
            ->map(fn($row) => [
                'label' => (string) $row->label,
                'value' => (int) $row->value,
            ]);
    }

    protected function attachSliceColors(Collection $rows, array $colors): Collection
    {
        return $rows->values()->map(function (array $row, int $index) use ($colors) {
            return [
                ...$row,
                'fill' => $colors[$index % count($colors)],
            ];
        });
    }

    protected function formatRatio(int $numerator, int $denominator): string
    {
        return number_format($numerator) . ' / ' . number_format($denominator);
    }

    protected function formatPercentage(int $numerator, int $denominator, int $precision = 1): string
    {
        if ($denominator <= 0) {
            return '0%';
        }

        $percentage = round(($numerator / $denominator) * 100, $precision);
        $formatted = number_format($percentage, $precision, '.', '');

        return rtrim(rtrim($formatted, '0'), '.') . '%';
    }

    protected function trendLabel(Collection $series, string $key, bool $monthly = true): string
    {
        if ($series->count() < 2) {
            return $monthly ? 'Need more history' : 'Current snapshot';
        }

        $last = (int) ($series->last()[$key] ?? 0);
        $previous = (int) ($series->slice(-2, 1)->first()[$key] ?? 0);

        if ($previous === 0) {
            return $monthly ? 'Compared with previous month' : 'Current snapshot';
        }

        $change = (($last - $previous) / $previous) * 100;
        $direction = $change >= 0 ? 'up' : 'down';

        return ($monthly ? 'Month-over-month ' : '') . $direction . ' ' . abs(round($change, 1)) . '%';
    }

    protected function trendValue(Collection $series, string $key): string
    {
        if ($series->isEmpty()) {
            return '0';
        }

        return (string) (($series->last()[$key] ?? 0));
    }

    protected function sparkline(Collection $series, string $key, bool $cumulative = false): array
    {
        $running = 0;

        return $series->values()->map(function (array $row, int $index) use ($key, $cumulative, &$running) {
            $value = (int) ($row[$key] ?? 0);

            if ($cumulative) {
                $running += $value;
            }

            return [
                'label' => $row['month'] ?? ($index + 1),
                'value' => $cumulative ? $running : $value,
            ];
        })->all();
    }

}
