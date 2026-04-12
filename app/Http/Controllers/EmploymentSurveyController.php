<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateAlumni\EmploymentDetailsRequest;
use App\Models\Alumni;
use App\Models\AlumniEmploymentDetails;
use App\Models\User;
use App\Notifications\EmploymentSurveySubmittedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmploymentSurveyController extends Controller
{
    public function show(Request $request): Response
    {
        $alumni = Alumni::query()
            ->with([
                'personal_details',
                'academic_details.branchRelation',
                'academic_details.departmentRelation',
                'academic_details.courseRelation',
                'contact_details',
                'employment_details',
            ])
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->where('alumni.user_id', $request->user()->user_id)
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.email', 'users.name')
            ->firstOrFail();

        return Inertia::render('alumni/employment-survey', [
            'alumni' => $alumni,
        ]);
    }

    public function store(EmploymentDetailsRequest $request): RedirectResponse
    {
        $alumni = Alumni::query()
            ->with(['employment_details'])
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->where('alumni.user_id', $request->user()->user_id)
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.email', 'users.name')
            ->firstOrFail();

        AlumniEmploymentDetails::query()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($request->validated(), ['alumni_id' => $alumni->alumni_id]),
        );

        $alumni->load('employment_details');

        User::query()
            ->where('user_type', 'admin')
            ->where('status', 'active')
            ->get()
            ->each(fn (User $admin) => $admin->notify(new EmploymentSurveySubmittedNotification($alumni)));

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Survey submitted',
            'modal_message' => 'Your employment survey was saved successfully.',
        ]);
    }
}
