<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Http\Requests\CourseRequest;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $branchId = $request->integer('branch_id');
        $departmentId = $request->integer('department_id');

        $query = Course::with(['branch', 'department.branch'])->orderBy('name', 'asc');

        if ($search !== '') {
            $query->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($branchId) {
            $query->where('branch_id', $branchId);
        }

        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }

        return Inertia::render('admin/courses', [
            'courses' => $query->paginate(15)->withQueryString(),
            'branches' => Branch::query()
                ->with(['departments' => fn ($query) => $query->orderBy('name')])
                ->orderBy('name')
                ->get(),
            'departments' => Department::with('branch')->orderBy('name')->get(),
        ]);
    }

    public function store(CourseRequest $request): RedirectResponse
    {
        Course::create($request->validated());
        return redirect()->route('courses.index')->with('success', 'Course created.');
    }

    public function update(CourseRequest $request, Course $course): RedirectResponse
    {
        $course->update($request->validated());
        return redirect()->route('courses.index')->with('success', 'Course updated.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();
        return redirect()->route('courses.index')->with('success', 'Course deleted.');
    }
}
