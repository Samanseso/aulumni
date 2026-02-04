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
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        // 1. Validate inputs
        // $validated = $request->validate([
        //     'branch'       => 'nullable|string',
        //     'department'   => 'nullable|string',
        //     'search'       => 'nullable|string|max:255',
        //     'rows'         => 'nullable|integer|min:1|max:99',
        //     'sort'         => 'nullable|string|max:1000',
        // ]);

        // 2. Buld query and add filters
        // $query = Employee::query()
        //     ->leftJoin('users', 'employees.user_id', '=', 'users.user_id')
        //     ->select('employees.*', 'users.name', 'users.user_name', 'users.email', 'users.status')
        //     ->whereNotNull('employees.employee_id');

       
        // if (!empty($validated['branch'])) {
        //     $query->where('employees.branch', $validated['branch']);
        // }

        // if (!empty($validated['department'])) {
        //     $query->where('employees.department', $validated['department']);
        // }


        // // 3. Apply search query
        // if (!empty($validated['search'])) {
        //     $search = trim($validated['search']);
        //     $query->whereRaw('LOWER(users.name) LIKE ?', ['%' . Str::lower($search) . '%']);
        // }

        // // 4. Sorting (example: col:dir pairs)
        // $allowedSortColumns = [
        //     'employee_id'  => 'employees.employee_id',
        //     'name'         => 'users.name',
        //     'created_at'   => 'employees.created_at',
        // ];


        // // 4. Sorting (example: col:dir pairs)
        // $sortConfig = [];
        // $index = 1;
        // if (!empty($validated['sort'])) {
        //     $pairs = array_filter(array_map('trim', explode(',', $validated['sort'])));
        //     foreach ($pairs as $pair) {
        //         $parts = explode(':', $pair, 2);
        //         if (count($parts) !== 2) {
        //             continue;
        //         }
        //         [$colKey, $dir] = $parts;
        //         $colKey = trim($colKey);
        //         $dir = strtolower(trim($dir)) === 'desc' ? 'desc' : 'asc';

        //         if (! array_key_exists($colKey, $allowedSortColumns)) {
        //             continue;
        //         }
        //         $sortConfig[] = ['number' => $index++, 'column' => $colKey, 'ascending' => $dir === 'asc'];
        //         $query->orderBy($allowedSortColumns[$colKey], $dir);
        //     }
        // }

        // // 5. Default ordering if none applied
        // if (empty($query->getQuery()->orders)) {
        //     $query->orderBy('employees.created_at', 'desc');
        // }


        $rows = $request->input('rows', 10);

        // 6. Pagination and response
        $admins = User::where('user_type', 'admin')->paginate($rows);

        return Inertia::render('admin/admins', [
            'admins' => $admins,
            // 'branches' => Branch::all(),
            // 'departments' => Department::all(),
             'sortConfig'  => [],
        ]);
    }

    public function import(Request $request): RedirectResponse
    {

        // Get row count
        $collection = Excel::toCollection(new Employee, $request->file('file'));
        $rowCount = $collection->first()->count();

        // Insert to database
        Excel::import(new EmployeeImport, $request->file('file'));

        return redirect()->route('employee.index')->with([
            'modal_status' => "success",
            'modal_action' => "create",
            'modal_title' => "Import successful!",
            'modal_message' => "$rowCount emmployee accounts was created successfully.",
        ]);
    }

    public function export_employee()
    {
        return Excel::download(new EmployeeExport, 'employee.xlsx');
    }

    public function store (EmployeeDetailsRequest $request): RedirectResponse
    {

        $attempt = 0;
        do {
            $attempt++;
            $employee_id = "EMP-" . sprintf('%05d', $attempt);

            if (Employee::where('employee_id', $employee_id)->count() == 0) {
                break;
            }
        } while ($attempt < 99999);


        $password = (
            $request->first_name .
            $request->middle_name .
            $request->last_name .
            '@' . date('Y')
        );


        $input = [
            'name' => $request->first_name . " " . $request->last_name  ?? 'No Name',
            'email' => $request->email,
            'user_type' => 'employee',
            'password' => $password,
            'password_confirmation' => $password,
        ];

        $user = app(CreateNewUser::class)->create($input);

        $employee = new Employee();
        $employee->fill([
            'employee_id'      => $employee_id,
            'user_id'          => $user->user_id,
            'first_name'       => $request->first_name,
            'middle_name'      => $request->first_name,
            'last_name'        => $request->first_name,
            'contact'          => $request->contact,
            'branch'           => $request->branch,
            'department'       => $request->department
        ]);
        $employee->save();

        return redirect()->route('employee.index')->with([
            'modal_status' => "success",
            'modal_action' => "create",
            'modal_title' => "Create successful!",
            'modal_message' => "Emmployee $employee_id was added successfully.",
        ]);

    }

    
}
