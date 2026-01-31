<?php

namespace App\Http\Controllers\User;

use App\Actions\Fortify\CreateNewUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateEmployee\EmployeeDetailsRequest;
use App\Imports\EmployeeImport;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::query()
            ->leftJoin('users', 'employees.user_id', '=', 'users.user_id')
            ->select('employees.*', 'users.name', 'users.user_name', 'users.email', 'users.status')
            ->whereNotNull('employees.employee_id');

        $rows = $request->input('rows', 15);

         $employees = $query->orderBy('employees.created_at', 'desc')
            ->paginate($rows)
            ->withQueryString();

        return Inertia::render('admin/employees', [
            'employees' => $employees,
        ]);
    }

    public function import(Request $request)//: RedirectResponse
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

    public function store (EmployeeDetailsRequest $request) 
    {
    
        // Change the logic of id generation, reset to 1 if a new year was used
        $employee_id = date('y') . "-" . sprintf('%05d', Employee::count() + 1);
        $password = (
            $request->first_name .
            $request->middle_name .
            $request->last_name .
            '@' . date('Y')
        );


        $input = [
            'name' => $request->first_name . " " . $request->last_name  ?? 'No Name',
            'email' => $request->email,
            'user_type' => 'alumni',
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



    }

    
}
