<?php

namespace App\Http\Middleware;

use App\Models\SystemLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class RecordAdminActions
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $user = $request->user();

        if (! $user || $user->user_type !== 'admin') {
            return $response;
        }

        if (in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'], true)) {
            return $response;
        }

        if ($response->getStatusCode() >= 500) {
            return $response;
        }

        if ($request->hasSession() && $request->session()->has('errors')) {
            return $response;
        }

        SystemLog::query()->create([
            'user_id' => $user->user_id,
            'user_name' => $user->user_name,
            'user_type' => $user->user_type,
            'action' => $this->resolveAction($request),
            'resource' => $this->resolveResource($request),
            'route_name' => $request->route()?->getName(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip_address' => $request->ip(),
            'summary' => $this->buildSummary($request),
            'metadata' => [
                'payload' => $this->sanitizePayload($request),
                'route_parameters' => $this->sanitizeRouteParameters($request),
            ],
        ]);

        return $response;
    }

    protected function resolveAction(Request $request): string
    {
        return match ($request->route()?->getActionMethod()) {
            'store' => 'Create',
            'update' => 'Update',
            'destroy' => 'Delete',
            'activate' => 'Activate',
            'deactivate' => 'Deactivate',
            'bulk_activate' => 'Bulk Activate',
            'bulk_deactivate' => 'Bulk Deactivate',
            'bulk_delete' => 'Bulk Delete',
            'approve' => 'Approve',
            'reject' => 'Reject',
            'import' => 'Import',
            default => Str::of($request->route()?->getActionMethod() ?: $request->method())
                ->replace('_', ' ')
                ->headline()
                ->value(),
        };
    }

    protected function resolveResource(Request $request): string
    {
        $routeName = $request->route()?->getName();
        $prefix = $routeName ? explode('.', $routeName)[0] : null;

        $resource = match ($prefix) {
            'user' => 'Users',
            'admin' => 'Admins',
            'employee' => 'Employees',
            'alumni' => 'Alumni',
            'branches' => 'Branches',
            'departments' => 'Departments',
            'batches' => 'Batches',
            'courses' => 'Courses',
            'post' => 'Job Posts',
            'notifications' => 'Notifications',
            'dashboard' => 'Dashboard Reports',
            'system-logs' => 'System Logs',
            default => null,
        };

        if ($resource) {
            return $resource;
        }

        $segments = collect(explode('/', trim($request->path(), '/')))
            ->reject(fn (string $segment) => in_array($segment, ['utility', 'content', 'user'], true));

        return Str::headline($segments->first() ?: 'System');
    }

    protected function buildSummary(Request $request): string
    {
        $action = $this->resolveAction($request);
        $resource = $this->resolveResource($request);
        $bulkCount = collect($request->all())
            ->filter(fn ($value, $key) => str_ends_with((string) $key, '_ids') && is_array($value))
            ->map(fn (array $ids) => count($ids))
            ->first();

        if ($bulkCount) {
            return "{$action} {$bulkCount} {$resource} record(s).";
        }

        $subject = collect($this->sanitizeRouteParameters($request))
            ->filter(fn ($value) => filled($value))
            ->first();

        if ($subject) {
            return "{$action} {$resource}: {$subject}.";
        }

        return "{$action} {$resource}.";
    }

    protected function sanitizePayload(Request $request): array
    {
        $payload = $request->except([
            'password',
            'password_confirmation',
            'current_password',
            'attachments',
        ]);

        return collect($payload)
            ->map(function ($value) {
                if (! is_array($value)) {
                    return $value;
                }

                if (count($value) > 10) {
                    return [
                        'count' => count($value),
                        'sample' => array_slice($value, 0, 5),
                    ];
                }

                return $value;
            })
            ->when(
                $request->hasFile('attachments'),
                fn (Collection $collection) => $collection->put('attachments_count', count($request->file('attachments', []))),
            )
            ->all();
    }

    protected function sanitizeRouteParameters(Request $request): array
    {
        return collect($request->route()?->parameters() ?? [])
            ->map(function ($value) {
                if (is_scalar($value) || $value === null) {
                    return $value;
                }

                if (is_object($value)) {
                    foreach (['name', 'user_name', 'email', 'course_id', 'department_id', 'branch_id', 'year', 'post_id', 'user_id'] as $attribute) {
                        if (isset($value->{$attribute})) {
                            return $value->{$attribute};
                        }
                    }
                }

                return Str::headline(class_basename($value));
            })
            ->all();
    }
}
