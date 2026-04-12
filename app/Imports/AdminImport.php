<?php

namespace App\Imports;

use App\Actions\Fortify\CreateNewUser;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AdminImport implements ToCollection, WithHeadingRow
{
    public function __construct(
        protected ?int $createdBy = null,
    ) {
    }

    public function collection(Collection $rows): void
    {
        foreach ($rows as $row) {
            $name = trim((string) ($row['name'] ?? ''));
            $email = trim((string) ($row['email'] ?? ''));

            if ($name === '' || $email === '') {
                continue;
            }
            
            $password = Str::slug($name, '').'@'.date('Y');
            

            app(CreateNewUser::class)->create([
                'name' => $name,
                'email' => $email,
                'user_type' => 'admin',
                'password' => $password,
                'password_confirmation' => $password,
                'status' => $row['status'] ?? 'pending',
                'created_by' => $this->createdBy,
            ]);
        }
    }
}
