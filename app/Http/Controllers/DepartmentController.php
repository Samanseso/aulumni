<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\View\View;

class DepartmentController extends Controller
{
    public function index()
    {
        $department = Department::paginate(15)->withQueryString();
        return Inertia::render('admin/departments', ['department' => $department]);
    }


    public function store(DepartmentRequest $request): RedirectResponse
    {
        Department::create($request->validated());
        return redirect()->route('departments.index')->with('success', 'Department created.');
    }

    public function update(DepartmentRequest $request, Department $department): RedirectResponse
    {
        $department->update($request->validated());
        return redirect()->route('departments.index')->with('success', 'Department updated.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $department->delete();
        return redirect()->route('departments.index')->with('success', 'Department deleted.');
    }
}
