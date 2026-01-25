<?php

namespace App\Http\Controllers\User;

use App\Actions\Fortify\CreateNewUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateAlumni\PersonalDetailsRequest;
use App\Http\Requests\CreateAlumni\ContactDetailsRequest;
use App\Http\Requests\CreateAlumni\AcademicDetailsRequest;
use App\Http\Requests\CreateAlumni\EmploymentDetailsRequest;
use App\Http\Requests\UserRequest;
use App\Imports\AlumniImport;
use App\Models\Alumni;
use App\Models\AlumniAcademicDetails;
use App\Models\AlumniContactDetails;
use App\Models\AlumniEmploymentDetails;
use App\Models\AlumniPersonalDetails;
use App\Models\Batch;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Database\QueryException;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\RedirectResponse;

class AlumniController extends Controller
{

    public function index(Request $request)
    {
        $query = Alumni::with([
            'personal_details',
            'academic_details',
            'contact_details',
            'employment_details',
        ])
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.name')
            ->whereNotNull('alumni.alumni_id');

        // filter by school_level
        if ($request->filled('school_level')) {
            $schoolLevel = $request->input('school_level');
            $query->whereHas('academic_details', function ($q) use ($schoolLevel) {
                $q->where('school_level', $schoolLevel);
            });
        }

        // filter by course
        if ($request->filled('course')) {
            $course = $request->input('course');
            $query->whereHas('academic_details', function ($q) use ($course) {
                $q->where('course', $course);
            });
        }


        if ($request->filled('batch')) {
            $batch = $request->input('batch');
            $query->whereHas('academic_details', function ($q) use ($batch) {
                $q->where('batch', $batch);
            });
        }

        $alumni = $query->orderBy('alumni.created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/alumni', [
            'alumni' => $alumni,
            'filters' => $request->only(['school_level']),
            'courses' => Course::all(),
            'batches' => Batch::all(),
        ]);
    }



    public function step($step)
    {
        if (!session('current_step')) {
            session(['current_step' => 1]);
        }
        if ((int)$step > 1 && (int)$step > session('current_step')) {
            return redirect()
                ->route('alumni.step', ['step' => session('current_step')])
                ->with([
                    'modal_status' => "error",
                    'modal_action' => "error",
                    'modal_title' => "Error!",
                    'modal_message' => "Please finish step " . session('current_step') . " first!",
                ]);
        };

        switch ($step) {
            case 1:
                return $this->render_basic_information();
            case 2:
                return $this->render_academic_details();
            case 3:
                return $this->render_contact_details();
            case 4:
                return $this->render_employment_details();
            default:
                return redirect()->route('alumni.step', ['step' => 1]);
        }
    }

    public function render_basic_information()
    {

        return Inertia::render('admin/create-alumni/personal', [
            'step' => 1,
            'alumni_personal_details' => session('alumni_personal_details', [])
        ]);
    }

    public function render_academic_details()
    {
        return Inertia::render('admin/create-alumni/academic', [
            'step' => 2,
            'alumni_academic_details' => session('alumni_academic_details', [])
        ]);
    }

    public function render_contact_details()
    {

        return Inertia::render('admin/create-alumni/contact', [
            'step' => 3,
            'alumni_contact_details' => session('alumni_contact_details', [])
        ]);
    }

    public function render_employment_details()
    {

        return Inertia::render('admin/create-alumni/employment', [
            'step' => 4
        ]);
    }

    public function process_personal_details(PersonalDetailsRequest $request): RedirectResponse
    {

        session(['alumni_personal_details' => $request->all()]);
        session(['current_step' => 2]);
        return redirect()->route('alumni.step', ['step' => 2]);
    }

    public function process_academic_details(AcademicDetailsRequest $request): RedirectResponse
    {

        session(['alumni_academic_details' => $request->all()]);
        session(['current_step' => 3]);
        return redirect()->route('alumni.step', ['step' => 3]);
    }

    public function process_contact_details(ContactDetailsRequest $request): RedirectResponse
    {
        session(['alumni_contact_details' => $request->all()]);
        session(['current_step' => 4]);
        return redirect()->route('alumni.step', ['step' => 4]);
    }

    public function process_employment_details(EmploymentDetailsRequest $request): RedirectResponse
    {

        $attempt = 0;
        do {
            $attempt++;
            $alumni_id = date('y') . "-" . sprintf('%05d', $attempt);

            if (Alumni::where('alumni_id', $alumni_id)->count() == 0) {
                break;
            }
        } while ($attempt < 99999);

        $password = (
            session('alumni_personal_details')['first_name'][0] .
            session('alumni_personal_details')['middle_name'][0] .
            session('alumni_personal_details')['last_name'][0] .
            '@' . date('Y')
        );

        $input = [
            'name' => session('alumni_personal_details')['first_name'] . " " . session('alumni_personal_details')['last_name'] ?? 'No Name',
            'email' => session('alumni_contact_details')['email'],
            'user_type' => 'alumni',
            'password' => $password,
            'password_confirmation' => $password,
        ];

        $user = app(CreateNewUser::class)->create($input);


        // Save alumni alumni record
        $alumni = new Alumni();
        $alumni->fill([
            'alumni_id'  => $alumni_id,
            'user_id'       => $user->user_id,
        ]);
        $alumni->save();


        // Save alumni personal details
        $alumni_personal = new AlumniPersonalDetails();
        $alumni_personal->fill(array_merge(
            session('alumni_personal_details', []),
            ['alumni_id' => $alumni_id]
        ));
        $alumni_personal->save();


        // Save alumni academic details
        $alumni_academic = new AlumniAcademicDetails();
        $alumni_academic->fill(array_merge(
            session('alumni_academic_details', []),
            ['alumni_id' => $alumni_id]
        ));
        $alumni_academic->save();

        // Save alumni contact details
        $alumni_contact = new AlumniContactDetails();
        $alumni_contact->fill(array_merge(
            session('alumni_contact_details', []),
            ['alumni_id' => $alumni_id]
        ));
        $alumni_contact->save();

        // Save alumni employment details
        $alumni_employment = new AlumniEmploymentDetails();
        $alumni_employment->fill(array_merge(
            $request->all(),
            ['alumni_id' => $alumni_id]
        ));
        $alumni_employment->save();

        // Clear the session data
        session()->forget(['alumni_personal_details', 'alumni_academic_details', 'alumni_contact_details', 'current_step']);

        return redirect()->route('alumni.index')->with([
            'modal_status' => "success",
            'modal_action' => "create",
            'modal_title' => "Create successful!",
            'modal_message' => "Alumni #$alumni_id was added successfully.",
        ]);
    }

    public function import(Request $request): RedirectResponse
    {

        // Get row count
        $collection = Excel::toCollection(new AlumniImport, $request->file('file'));
        $rowCount = $collection->first()->count();

        // Insert to database
        Excel::import(new AlumniImport, $request->file('file'));

        return redirect()->route('alumni.index')->with([
            'modal_status' => "success",
            'modal_action' => "create",
            'modal_title' => "Import successful!",
            'modal_message' => "$rowCount alumni accounts was created successfully.",
        ]);
    }


    public function update_profile(UserRequest $request, User $user)
    {

        try {
            $user->update($request->all());

            return back()->with([
                'modal_status' => "success",
                'modal_action' => "update",
                'modal_title' => "Update successful!",
                'modal_message' => "Alumni profile details was updated successfully.",
            ]);
        } catch (QueryException $e) {
            if ($e->errorInfo[1] == 1062) {
                return back()->with([
                    'modal_status' => "error",
                    'modal_action' => "update",
                    'modal_title' => "Update unsuccessful!",
                    'modal_message' => "Username already in use.",
                ]);
            }
            throw $e;
        }
    }

    public function update_personal(PersonalDetailsRequest $request, Alumni $alumni)
    {

        $alumni->update($request->all());

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Update successful!",
            'modal_message' => "Alumni persoanl details was updated successfully.",
        ]);
    }

    public function update_academic(AcademicDetailsRequest $request, Alumni $alumni)
    {

        $alumni->update($request->all());

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Update successful!",
            'modal_message' => "Alumni academic details was updated successfully.",
        ]);
    }

    public function update_contact(ContactDetailsRequest $request, Alumni $alumni)
    {

        $alumni->update($request->all());

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Update successful!",
            'modal_message' => "Alumni contact details was updated successfully.",
        ]);
    }

    public function update_employment(EmploymentDetailsRequest $request, Alumni $alumni)
    {

        $alumni->update($request->all());

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Update successful!",
            'modal_message' => "Alumni employment details was updated successfully.",
        ]);
    }
}
