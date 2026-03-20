<?php

namespace App\Http\Controllers;

use App\Http\Requests\BatchRequest;
use App\Models\AlumniAcademicDetails;
use App\Models\Batch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BatchController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $rows = min(max((int) $request->input('rows', 10), 1), 100);

        $query = Batch::query()
            ->withCount(['academicDetails as alumni_count'])
            ->orderByDesc('year');

        if ($search !== '') {
            $query->where(function ($inner) use ($search) {
                $inner->where('year', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        return Inertia::render('admin/batches', [
            'batches' => $query->paginate($rows)->withQueryString(),
        ]);
    }

    public function store(BatchRequest $request): RedirectResponse
    {
        Batch::query()->create($request->validated());

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'create',
            'modal_title' => 'Batch created',
            'modal_message' => 'Batch was created successfully.',
        ]);
    }

    public function update(BatchRequest $request, Batch $batch): RedirectResponse
    {
        $validated = $request->validated();
        $originalYear = $batch->year;

        DB::transaction(function () use ($batch, $validated, $originalYear) {
            $batch->fill($validated);
            $batch->save();

            if ($originalYear !== $batch->year) {
                AlumniAcademicDetails::query()
                    ->where('batch', $originalYear)
                    ->update(['batch' => $batch->year]);
            }
        });

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Batch updated',
            'modal_message' => 'Batch was updated successfully.',
        ]);
    }

    public function destroy(Batch $batch): RedirectResponse
    {
        $alumniCount = $batch->academicDetails()->count();

        if ($alumniCount > 0) {
            return back()->with([
                'modal_status' => 'error',
                'modal_action' => 'delete',
                'modal_title' => 'Batch in use',
                'modal_message' => "Cannot delete batch {$batch->year} because it is assigned to {$alumniCount} alumni record(s).",
            ]);
        }

        $batch->delete();

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'delete',
            'modal_title' => 'Batch deleted',
            'modal_message' => 'Batch was deleted successfully.',
        ]);
    }
}
