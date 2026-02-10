<?php

namespace App\Http\Controllers\User;

use App\Actions\Fortify\CreateNewUser;
use App\Exports\AlumniExport;
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
use App\Models\Branch;
use App\Models\Course;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\RedirectResponse;

class AlumniController extends Controller
{
    public function index(Request $request)
    {
        // 1. Validate inputs
        $validated = $request->validate([
            'branch'       => 'nullable|string',
            'school_level' => 'nullable|string',
            'course'       => 'nullable|string',
            'batch'        => 'nullable|string',
            'status'       => 'nullable|string',
            'search'       => 'nullable|string|max:255',
            'rows'         => 'nullable|integer|min:1|max:99',
            'sort'         => 'nullable|string|max:1000',
        ]);

        $rows = $validated['rows'] ?? 10;

        // 2. Build query using left joins so all requested columns are available in the main query
        $query = Alumni::query()
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->leftJoin('alumni_personal_details', 'alumni.alumni_id', '=', 'alumni_personal_details.alumni_id')
            ->leftJoin('alumni_academic_details', 'alumni.alumni_id', '=', 'alumni_academic_details.alumni_id')
            ->select([
                'alumni.alumni_id as alumni_id',             // alumni table
                'users.user_id as user_id',
                'users.email as email',
                'users.user_name as user_name',
                'users.status as status',                    // users table
                'alumni_personal_details.first_name as first_name', // personal_details table
                'alumni_personal_details.last_name as last_name',   // personal_details table
                'alumni_academic_details.student_number as student_number', // academic_details table
                'alumni_academic_details.school_level as school_level',     // academic_details table
                'alumni_academic_details.course as course',                 // academic_details table
                'alumni_academic_details.branch as branch',                 // academic_details table
                'alumni_academic_details.batch as batch',                   // academic_details table
                'alumni.created_at as created_at'                    // keep for default ordering
            ])
            ->whereNotNull('alumni.alumni_id');

        if (!empty($validated['branch'])) {
            $query->where('alumni_academic_details.branch', $validated['branch']);
        }

        if (!empty($validated['school_level'])) {
            $query->where('alumni_academic_details.school_level', $validated['school_level']);
        }

        if (!empty($validated['course'])) {
            $query->where('alumni_academic_details.course', $validated['course']);
        }

        if (!empty($validated['batch'])) {
            $query->where('alumni_academic_details.batch', $validated['batch']);
        }
        
        if (!empty($validated['status'])) {
            $query->where('users.status', $validated['status']);
        }


        // 3. Apply search query
        if (!empty($validated['search'])) {
            $search = trim($validated['search']);
            // case-insensitive search using LOWER on the joined users.user_name
            $query->whereRaw('LOWER(users.name) LIKE ?', ['%' . Str::lower($search) . '%']);
        }

        // 4. Sorting (example: col:dir pairs)
        $allowedSortColumns = [
            'alumni_id'         => 'alumni.alumni_id',
            'created_at'        => 'alumni.created_at',
            'student_number'    => 'alumni_academic_details.student_number',
            'name'              => 'users.name',
            'batch'             => 'alumni_academic_details.batch',
        ];

        $sortConfig = [];
        $index = 1;
        if (!empty($validated['sort'])) {
            $pairs = array_filter(array_map('trim', explode(',', $validated['sort'])));
            foreach ($pairs as $pair) {
                $parts = explode(':', $pair, 2);
                if (count($parts) !== 2) {
                    continue;
                }
                [$colKey, $dir] = $parts;
                $colKey = trim($colKey);
                $dir = strtolower(trim($dir)) === 'desc' ? 'desc' : 'asc';

                if (! array_key_exists($colKey, $allowedSortColumns)) {
                    continue;
                }
                $sortConfig[] = ['number' => $index++, 'column' => $colKey, 'ascending' => $dir === 'asc'];
                $query->orderBy($allowedSortColumns[$colKey], $dir);
            }
        }

        // 5. Default ordering if none applied
        if (empty($query->getQuery()->orders)) {
            $query->orderBy('alumni.created_at', 'desc');
        }



        // 6. Pagination and response
        $alumni_row = $query->paginate($rows)->withQueryString();


        return Inertia::render('admin/alumni', [
            'alumni'      => $alumni_row,
            'branches'    => Branch::all(),
            'courses'     => Course::all(),
            'batches'     => Batch::all(),
            'sortConfig'  => $sortConfig,
        ]);
    }

    public function show($user_name)
    {
        $alumni = Alumni::with(['personal_details', 'academic_details', 'contact_details', 'employment_details'])
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->where('users.user_name', $user_name)
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.email', 'users.name')
            ->firstOrFail();

        $posts = Post::with(['user', 'attachments'])->where('user_id', $alumni->user_id)->get();

        return Inertia::render('admin/alumni-profile/all', [
            'alumni' => $alumni,
            'posts'  => $posts,
        ]);
    }

    public function show_personal($alumni)
    {
        $alumni = Alumni::with(['personal_details', 'academic_details', 'contact_details', 'employment_details'])
            ->where('alumni_id', $alumni)
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.name')
            ->firstOrFail();

        return Inertia::render('admin/alumni-profile/personal', [
            'alumni' => $alumni,
        ]);
    }


    public function show_academic($alumni)
    {
        $alumni = Alumni::with(['personal_details', 'academic_details', 'contact_details', 'employment_details'])
            ->where('alumni_id', $alumni)
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.name')
            ->firstOrFail();

        return Inertia::render('admin/alumni-profile/academic', [
            'alumni' => $alumni,
        ]);
    }

    public function show_contact($alumni)
    {
        $alumni = Alumni::with(['personal_details', 'academic_details', 'contact_details', 'employment_details'])
            ->where('alumni_id', $alumni)
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.name')
            ->firstOrFail();

        return Inertia::render('admin/alumni-profile/contact', [
            'alumni' => $alumni,
        ]);
    }

    public function show_employment($alumni)
    {
        $alumni = Alumni::with(['personal_details', 'academic_details', 'contact_details', 'employment_details'])
            ->where('alumni_id', $alumni)
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.name')
            ->firstOrFail();

        return Inertia::render('admin/alumni-profile/employment', [
            'alumni' => $alumni,
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
            'modal_message' => $this->num_to_words($rowCount) . " alumni accounts was created successfully.",
        ]);
    }



    public function export_alumni()
    {
        return Excel::download(new AlumniExport, 'alumni.xlsx');
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
        $personalDetails = AlumniPersonalDetails::findOrFail($alumni->alumni_id);
        $personalDetails->update($request->all());

        return back()->with([
            'modal_status'  => "success",
            'modal_action'  => "update",
            'modal_title'   => "Update successful!",
            'modal_message' => "Alumni personal details were updated successfully.",
        ]);
    }


    public function update_academic(AcademicDetailsRequest $request, Alumni $alumni)
    {

        $academicDetails = AlumniAcademicDetails::findOrFail($alumni->alumni_id);
        $academicDetails->update($request->all());

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Update successful!",
            'modal_message' => "Alumni academic details was updated successfully.",
        ]);
    }

    public function update_contact(ContactDetailsRequest $request, Alumni $alumni)
    {

        $contactDetails = AlumniContactDetails::findOrFail($alumni->alumni_id);
        $contactDetails->update($request->all());

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Update successful!",
            'modal_message' => "Alumni contact details was updated successfully.",
        ]);
    }

    public function update_employment(EmploymentDetailsRequest $request, Alumni $alumni)
    {

        $employmentDetails = AlumniEmploymentDetails::findOrFail($alumni->alumni_id);
        $employmentDetails->update($request->all());

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Update successful!",
            'modal_message' => "Alumni employment details was updated successfully.",
        ]);
    }



    function num_to_words($number)
    {
        $words = array(
            0 => 'zero',
            1 => 'one',
            2 => 'two',
            3 => 'three',
            4 => 'four',
            5 => 'five',
            6 => 'six',
            7 => 'seven',
            8 => 'eight',
            9 => 'nine',
            10 => 'ten',
            11 => 'eleven',
            12 => 'twelve',
            13 => 'thirteen',
            14 => 'fourteen',
            15 => 'fifteen',
            16 => 'sixteen',
            17 => 'seventeen',
            18 => 'eighteen',
            19 => 'nineteen',
            20 => 'twenty',
            30 => 'thirty',
            40 => 'forty',
            50 => 'fifty',
            60 => 'sixty',
            70 => 'seventy',
            80 => 'eighty',
            90 => 'ninety'
        );

        if ($number < 20) {
            return $words[$number];
        }

        if ($number < 100) {
            return $words[10 * floor($number / 10)] .
                ' ' . $words[$number % 10];
        }

        if ($number < 1000) {
            return $words[floor($number / 100)] . ' hundred '
                . $this->num_to_words($number % 100);
        }

        if ($number < 1000000) {
            return $this->num_to_words(floor($number / 1000)) .
                ' thousand ' . $this->num_to_words($number % 1000);
        }

        return $this->num_to_words(floor($number / 1000000)) .
            ' million ' . $this->num_to_words($number % 1000000);
    }
}
