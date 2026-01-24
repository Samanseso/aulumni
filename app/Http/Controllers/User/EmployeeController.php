<?php

namespace App\Http\Controllers\User;

use App\Actions\Fortify\CreateNewUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateEmployee\EmployeeDetailsRequest;
use App\Imports\EmployeeImport;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\RedirectResponse;

class EmployeeController extends Controller
{
    public function index()
    {
        $employee = Employee::query()
            ->leftJoin('users', 'employee.user_id', '=', 'users.user_id')
            ->select('employee.*', 'users.email', 'users.status')
            ->orderBy('employee.created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/employee', [
            'employee' => $employee,
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
