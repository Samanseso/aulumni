<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepartmentRequest;
use App\Models\AlumniAcademicDetails;
use App\Models\Branch;
use App\Models\Course;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $branchId = $request->integer('branch_id');
        $rows = min(max((int) $request->input('rows', 10), 1), 100);

        $query = Department::query()
            ->with('branch')
            ->withCount(['courses', 'employees', 'academicDetails as alumni_count'])
            ->orderBy('name');

        if ($search !== '') {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        return Inertia::render('admin/departments', [
            'departments' => $query->paginate($rows)->withQueryString(),
            'branches' => Branch::query()->orderBy('name')->get(),
        ]);
    }

    public function store(DepartmentRequest $request): RedirectResponse
    {
        Department::query()->create($request->validated());

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'create',
            'modal_title' => 'Department created',
            'modal_message' => 'Department was created successfully.',
        ]);
    }

    public function update(DepartmentRequest $request, Department $department): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($department, $validated) {
            $department->update($validated);

            $branchName = Branch::query()
                ->where('branch_id', $department->branch_id)
                ->value('name');

            Course::query()
                ->where('department_id', $department->department_id)
                ->update(['branch_id' => $department->branch_id]);

            Employee::query()
                ->where('department_id', $department->department_id)
                ->update([
                    'branch_id' => $department->branch_id,
                    'branch' => $branchName,
                    'department' => $department->name,
                ]);

            AlumniAcademicDetails::query()
                ->where('department_id', $department->department_id)
                ->update([
                    'branch_id' => $department->branch_id,
                    'branch' => $branchName,
                ]);
        });

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Department updated',
            'modal_message' => 'Department was updated successfully.',
        ]);
    }

    public function destroy(Department $department): RedirectResponse
    {
        $counts = [
            'course(s)' => $department->courses()->count(),
            'employee account(s)' => $department->employees()->count(),
            'alumni academic record(s)' => $department->academicDetails()->count(),
        ];

        $dependencies = collect($counts)
            ->filter(fn ($count) => $count > 0)
            ->map(fn ($count, $label) => "{$count} {$label}")
            ->values()
            ->all();

        if ($dependencies !== []) {
            return back()->with([
                'modal_status' => 'error',
                'modal_action' => 'delete',
                'modal_title' => 'Department in use',
                'modal_message' => 'Cannot delete this department because it still has related records: ' . implode(', ', $dependencies) . '.',
            ]);
        }

        $department->delete();

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'delete',
            'modal_title' => 'Department deleted',
            'modal_message' => 'Department was deleted successfully.',
        ]);
    }
}
