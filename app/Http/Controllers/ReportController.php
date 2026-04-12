<?php

namespace App\Http\Controllers;

use App\Exports\ReportsExport;
use App\Models\SystemLog;
use App\Support\AdminDashboardReportService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function exportWorkbook(Request $request, AdminDashboardReportService $dashboardReportService): BinaryFileResponse
    {
        $payload = $dashboardReportService->build();
        $user = $request->user();

        if ($user) {
            SystemLog::query()->create([
                'user_id' => $user->user_id,
                'user_name' => $user->user_name,
                'user_type' => $user->user_type,
                'action' => 'Export Workbook',
                'resource' => 'Dashboard Reports',
                'route_name' => $request->route()?->getName(),
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'ip_address' => $request->ip(),
                'summary' => 'Exported the full admin dashboard analytics workbook.',
                'metadata' => [
                    'format' => 'xlsx',
                    'export_scope' => 'dashboard-reports',
                ],
            ]);
        }

        return Excel::download(
            new ReportsExport(
                $payload['overview'] ?? [],
                $payload['insights'] ?? [],
                $payload['charts'] ?? [],
            ),
            'aulumni-dashboard-reports-'.now()->format('Ymd-His').'.xlsx'
        );
    }
}
