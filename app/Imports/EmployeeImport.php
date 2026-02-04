<?php

namespace App\Imports;

use App\Actions\Fortify\CreateNewUser;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Collection;

class EmployeeImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {

            $firstName  = $row['first_name'] ?? null;
            $middleName = $row['middle_name'] ?? null;
            $lastName   = $row['last_name'] ?? null;
            $email      = $row['email'] ?? null;
            $password   = $row['password'] ?? null;
            $status     = $row['status'] ?? 'pending';
            $contact    = $row['contact'] ?? null;
            $branch     = $row['branch'] ?? null;
            $department = $row['department'] ?? null;

            $attempt = 0;
            do {
                $attempt++;
                $employee_id = "EMP-" . sprintf('%05d', $attempt);

                if (Employee::where('employee_id', $employee_id)->count() == 0) {
                    break;
                }
            } while ($attempt < 99999);

            // Create the user account.
            $user = app(CreateNewUser::class)->create([
                'name' => ($firstName ?? '') . ' ' . ($lastName ?? '') ?: 'No Name',
                'email' => $email,
                'user_type' => 'employee',
                'password' => $password,
                'password_confirmation' => $password,
                'status'     => $status,
                'created_by' => Auth::id() ?? 1,
            ]);

            // Create or update the employee record.
            Employee::updateOrCreate(
                [
                    'employee_id' => $employee_id,
                    'user_id'     => $user->user_id,
                    'first_name'  => $firstName,
                    'middle_name' => $middleName,
                    'last_name'   => $lastName,
                    'contact'     => $contact,
                    'branch'      => $branch,
                    'department'  => $department,
                ]
            );
        }
    }
}
