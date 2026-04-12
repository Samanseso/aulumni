<?php

namespace App\Http\Controllers;

use App\Models\SystemLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemLogController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'method' => ['nullable', 'string', 'max:20'],
            'resource' => ['nullable', 'string', 'max:255'],
            'rows' => ['nullable', 'integer', 'min:10', 'max:100'],
        ]);

        $rows = $validated['rows'] ?? 15;
        $search = trim((string) ($validated['search'] ?? ''));
        $method = (string) ($validated['method'] ?? 'all');
        $resource = (string) ($validated['resource'] ?? 'all');

        $query = SystemLog::query()->latest();

        if ($search !== '') {
            $query->where(function ($inner) use ($search) {
                $inner->where('user_name', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhere('resource', 'like', "%{$search}%")
                    ->orWhere('route_name', 'like', "%{$search}%");
            });
        }

        if ($method !== '' && $method !== 'all') {
            $query->where('method', strtoupper($method));
        }

        if ($resource !== '' && $resource !== 'all') {
            $query->where('resource', $resource);
        }

        return Inertia::render('admin/system-logs', [
            'logs' => $query->paginate($rows)->withQueryString(),
            'filters' => [
                'search' => $search,
                'method' => $method,
                'resource' => $resource,
                'rows' => $rows,
            ],
            'resources' => SystemLog::query()
                ->select('resource')
                ->distinct()
                ->orderBy('resource')
                ->pluck('resource')
                ->values(),
            'overview' => [
                'total' => SystemLog::query()->count(),
                'today' => SystemLog::query()->whereDate('created_at', today())->count(),
                'last_7_days' => SystemLog::query()->where('created_at', '>=', now()->subDays(7))->count(),
                'bulk_actions' => SystemLog::query()->where('action', 'like', 'Bulk%')->count(),
            ],
        ]);
    }
}
