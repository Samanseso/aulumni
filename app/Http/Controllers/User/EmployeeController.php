<?php

namespace App\Http\Controllers\User;

use App\Actions\Fortify\CreateNewUser;
use App\Exports\EmployeeExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateEmployee\EmployeeDetailsRequest;
use App\Imports\EmployeeImport;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'branch' => 'nullable|string',
            'department' => 'nullable|string',
            'search' => 'nullable|string|max:255',
            'rows' => 'nullable|integer|min:1|max:99',
            'sort' => 'nullable|string|max:1000',
        ]);

        $query = Employee::query()
            ->leftJoin('users', 'employees.user_id', '=', 'users.user_id')
            ->select('employees.*', 'users.name', 'users.user_name', 'users.email', 'users.status')
            ->whereNotNull('employees.employee_id');

        if (! empty($validated['branch'])) {
            $query->where('employees.branch', $validated['branch']);
        }

        if (! empty($validated['department'])) {
            $query->where('employees.department', $validated['department']);
        }

        if (! empty($validated['search'])) {
            $search = trim($validated['search']);
            $query->whereRaw('LOWER(users.name) LIKE ?', ['%'.Str::lower($search).'%']);
        }

        $allowedSortColumns = [
            'employee_id' => 'employees.employee_id',
            'name' => 'users.name',
            'created_at' => 'employees.created_at',
        ];

        $sortConfig = [];
        $index = 1;

        if (! empty($validated['sort'])) {
            $pairs = array_filter(array_map('trim', explode(',', $validated['sort'])));

            foreach ($pairs as $pair) {
                $parts = explode(':', $pair, 2);

                if (count($parts) !== 2) {
                    continue;
                }

                [$column, $direction] = $parts;
                $column = trim($column);
                $direction = strtolower(trim($direction)) === 'desc' ? 'desc' : 'asc';

                if (! array_key_exists($column, $allowedSortColumns)) {
                    continue;
                }

                $sortConfig[] = [
                    'number' => $index++,
                    'column' => $column,
                    'ascending' => $direction === 'asc',
                ];

                $query->orderBy($allowedSortColumns[$column], $direction);
            }
        }

        if (empty($query->getQuery()->orders)) {
            $query->orderBy('employees.created_at', 'desc');
        }

        $employees = $query->paginate($validated['rows'] ?? 10)->withQueryString();

        return Inertia::render('admin/employees', [
            'employees' => $employees,
            'branches' => Branch::all(),
            'departments' => Department::all(),
            'sortConfig' => $sortConfig,
        ]);
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate(['file' => 'required|file']);

        $file = $request->file('file');
        $rowCount = Excel::toCollection(new EmployeeImport(), $file)->first()?->count() ?? 0;

        Excel::import(new EmployeeImport(), $file);

        return redirect()->route('employee.index')->with([
            'modal_status' => 'success',
            'modal_action' => 'create',
            'modal_title' => 'Import successful!',
            'modal_message' => "{$rowCount} employee accounts were imported successfully.",
        ]);
    }

    public function export_employee()
    {
        return Excel::download(new EmployeeExport(), 'employees.xlsx');
    }

    public function store(EmployeeDetailsRequest $request): RedirectResponse
    {
        $attempt = 0;

        do {
            $attempt++;
            $employeeId = 'EMP-'.sprintf('%05d', $attempt);
        } while (Employee::where('employee_id', $employeeId)->exists() && $attempt < 99999);

        $firstName = $request->string('first_name')->toString();
        $middleName = $request->string('middle_name')->toString();
        $lastName = $request->string('last_name')->toString();

        $password = Str::upper($firstName[0]).Str::lower($middleName[0]).Str::lower($lastName[0]).'@'.date('Y');

        $user = app(CreateNewUser::class)->create([
            'name' => trim($firstName.' '.$lastName) ?: 'No Name',
            'email' => $request->string('email')->toString(),
            'user_type' => 'employee',
            'password' => $password,
            'password_confirmation' => $password,
            'status' => 'pending',
            'created_by' => (string) $request->user()->user_id,
        ]);

        $employee = new Employee();
        $employee->fill([
            'employee_id' => $employeeId,
            'user_id' => $user->user_id,
            'first_name' => $firstName,
            'middle_name' => $middleName,
            'last_name' => $lastName,
            'contact' => $request->string('contact')->toString(),
            'branch' => $request->string('branch')->toString(),
            'department' => $request->string('department')->toString(),
        ]);
        $employee->save();

        return redirect()->route('employee.index')->with([
            'modal_status' => 'success',
            'modal_action' => 'create',
            'modal_title' => 'Create successful!',
            'modal_message' => "Employee {$employeeId} was added successfully.",
        ]);
    }
}
