<?php

namespace App\Imports;

use App\Actions\Fortify\CreateNewUser;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Employee;
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
            $branchModel = $branch
                ? Branch::query()->whereRaw('LOWER(name) = ?', [strtolower(trim((string) $branch))])->first()
                : null;
            $departmentQuery = Department::query();

            if ($branchModel) {
                $departmentQuery->where('branch_id', $branchModel->branch_id);
            }

            $departmentModel = $department
                ? $departmentQuery->whereRaw('LOWER(name) = ?', [strtolower(trim((string) $department))])->first()
                : null;

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
                'created_by' => Auth::id(),
            ]);

            // Create or update the employee record.
            Employee::updateOrCreate(
                [
                    'employee_id' => $employee_id,
                ],
                [
                    'user_id'     => $user->user_id,
                    'branch_id'   => $branchModel?->branch_id,
                    'department_id' => $departmentModel?->department_id,
                    'first_name'  => $firstName,
                    'middle_name' => $middleName,
                    'last_name'   => $lastName,
                    'contact'     => $contact,
                    'branch'      => $branchModel?->name ?? $branch,
                    'department'  => $departmentModel?->name ?? $department,
                ],
            );
        }
    }
}
