<?php

namespace App\Http\Controllers\User;

use App\Actions\Fortify\CreateNewUser;
use App\Exports\AdminExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminRequest;
use App\Imports\AdminImport;
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
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|in:active,pending,inactive',
            'rows' => 'nullable|integer|min:1|max:99',
            'sort' => 'nullable|string|max:1000',
        ]);

        $query = User::query()->where('user_type', 'admin');

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (! empty($validated['search'])) {
            $search = Str::lower(trim($validated['search']));

            $query->where(function ($inner) use ($search) {
                $inner->whereRaw('LOWER(name) LIKE ?', ['%'.$search.'%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%'.$search.'%'])
                    ->orWhereRaw('LOWER(user_name) LIKE ?', ['%'.$search.'%']);
            });
        }

        $allowedSortColumns = [
            'user_id' => 'user_id',
            'name' => 'name',
            'user_name' => 'user_name',
            'email' => 'email',
            'status' => 'status',
            'created_at' => 'created_at',
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
            $query->latest('created_at');
        }

        $admins = $query->paginate($validated['rows'] ?? 10)->withQueryString();

        return Inertia::render('admin/admins', [
            'admins' => $admins,
            'sortConfig' => $sortConfig,
        ]);
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate(['file' => 'required|file']);

        $file = $request->file('file');
        $rowCount = Excel::toCollection(new AdminImport(), $file)->first()?->count() ?? 0;

        Excel::import(new AdminImport((int) $request->user()->user_id), $file);

        return redirect()->route('admin.index')->with([
            'modal_status' => 'success',
            'modal_action' => 'create',
            'modal_title' => 'Import successful!',
            'modal_message' => "{$rowCount} admin accounts were imported successfully.",
        ]);
    }

    public function export_admin()
    {
        return Excel::download(new AdminExport(), 'admins.xlsx');
    }

    public function store(AdminRequest $request): RedirectResponse
    {
        $user = app(CreateNewUser::class)->create([
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
            'user_type' => 'admin',
            'password' => $request->string('password')->toString(),
            'password_confirmation' => $request->string('password_confirmation')->toString(),
            'status' => $request->input('status', 'pending'),
            'created_by' => (string) $request->user()->user_id,
        ]);

        return redirect()->route('admin.index')->with([
            'modal_status' => 'success',
            'modal_action' => 'create',
            'modal_title' => 'Create successful!',
            'modal_message' => "Admin account for {$user->name} was created successfully.",
        ]);
    }
}
