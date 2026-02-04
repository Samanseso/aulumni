<?php

namespace App\Exports;

use App\Models\Employee;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class EmployeeExport implements FromCollection, WithHeadings
{
    public function collection(): Collection
    {
        return Employee::with('user')->get()->map(function ($employee) {
            return [
                // USER table fields
                'user_id'             => optional($employee->user)->user_id,
                'user_name'           => optional($employee->user)->user_name,
                'name'                => optional($employee->user)->name,
                'email'               => optional($employee->user)->email,
                'user_type'           => optional($employee->user)->user_type,
                'status'              => optional($employee->user)->status,
        

                // EMPLOYEE table fields
                'employee_id'         => $employee->employee_id,
                'first_name'          => $employee->first_name,
                'middle_name'         => $employee->middle_name,
                'last_name'           => $employee->last_name,
                'contact'             => $employee->contact,
                'branch'              => $employee->branch,
                'department'          => $employee->department,
            ];
        });
    }

    public function headings(): array
    {
        return [
            // USER table headings
            'user_id',
            'user_name',
            'name',
            'email',
            'user_type',
            'status',
        
            // EMPLOYEE table headings
            'employee_id',
            'first_name',
            'middle_name',
            'last_name',
            'contact',
            'branch',
            'department',
        ];
    }
}
