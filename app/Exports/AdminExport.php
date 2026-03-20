<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AdminExport implements FromCollection, WithHeadings
{
    public function collection(): Collection
    {
        return User::query()
            ->where('user_type', 'admin')
            ->orderBy('name')
            ->get([
                'user_id',
                'user_name',
                'name',
                'email',
                'user_type',
                'status',
                'created_by',
                'created_at',
                'updated_at',
            ]);
    }

    public function headings(): array
    {
        return [
            'user_id',
            'user_name',
            'name',
            'email',
            'user_type',
            'status',
            'created_by',
            'created_at',
            'updated_at',
        ];
    }
}
