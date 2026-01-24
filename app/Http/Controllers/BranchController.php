<?php

namespace App\Http\Controllers;

use App\Http\Requests\BranchRequest;
use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\View\View;

class BranchController extends Controller
{
    public function index()
    {
        $branches = Branch::orderBy('branch_id', 'asc')->paginate(15)->withQueryString();
        return Inertia::render('admin/branch-list', ['branches' => $branches]);
    }


    public function store(BranchRequest $request): RedirectResponse
    {
        Branch::create($request->validated());
        return redirect()->route('branch.index')->with('success', 'Branch created.');
    }


    public function update(BranchRequest $request, Branch $branch): RedirectResponse
    {
        $branch->update($request->validated());
        return redirect()->route('branch.index')->with('success', 'Branch updated.');
    }

    public function destroy(Branch $branch): RedirectResponse
    {
        $branch->delete();
        return redirect()->route('branch.index')->with('success', 'Branch deleted.');
    }
}
