<?php

namespace App\Http\Controllers;

use App\Http\Requests\BranchRequest;
use App\Models\AlumniAcademicDetails;
use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $address = trim((string) $request->input('address', ''));
        $rows = min(max((int) $request->input('rows', 10), 1), 100);

        $query = Branch::query()
            ->withCount(['departments', 'courses', 'employees', 'academicDetails as alumni_count'])
            ->orderBy('name');

        if ($search !== '') {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('contact', 'like', "%{$search}%");
            });
        }

        if ($address !== '') {
            $query->where('address', $address);
        }

        $addresses = Branch::query()
            ->select('address')
            ->distinct()
            ->orderBy('address')
            ->pluck('address');

        return Inertia::render('admin/branches', [
            'branches' => $query->paginate($rows)->withQueryString(),
            'addresses' => $addresses,
        ]);
    }

    public function store(BranchRequest $request): RedirectResponse
    {
        Branch::query()->create($request->validated());

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'create',
            'modal_title' => 'Branch created',
            'modal_message' => 'Branch was created successfully.',
        ]);
    }

    public function update(BranchRequest $request, Branch $branch): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($branch, $validated) {
            $branch->update($validated);

            Employee::query()
                ->where('branch_id', $branch->branch_id)
                ->update(['branch' => $branch->name]);

            AlumniAcademicDetails::query()
                ->where('branch_id', $branch->branch_id)
                ->update(['branch' => $branch->name]);
        });

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Branch updated',
            'modal_message' => 'Branch was updated successfully.',
        ]);
    }

    public function destroy(Branch $branch): RedirectResponse
    {
        $counts = [
            'department(s)' => $branch->departments()->count(),
            'course(s)' => $branch->courses()->count(),
            'employee account(s)' => $branch->employees()->count(),
            'alumni academic record(s)' => $branch->academicDetails()->count(),
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
                'modal_title' => 'Branch in use',
                'modal_message' => 'Cannot delete this branch because it still has related records: ' . implode(', ', $dependencies) . '.',
            ]);
        }

        $branch->delete();

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'delete',
            'modal_title' => 'Branch deleted',
            'modal_message' => 'Branch was deleted successfully.',
        ]);
    }
}
