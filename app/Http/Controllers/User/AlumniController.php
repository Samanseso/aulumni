<?php

namespace App\Http\Controllers\User;

use App\Actions\Alumni\CreateAlumni;
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
use App\Models\Department;
use App\Models\Post;
use App\Models\User;
use App\Notifications\ImportReportNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\Failure;
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
            'rows'         => 'nullable|integer|min:1|max:999',
            'sort'         => 'nullable|string|max:1000',
        ]);

        $rows = $validated['rows'] ?? 10;

        // 2. Build query using left joins so all requested columns are available in the main query
        $query = Alumni::query()
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->leftJoin('alumni_personal_details', 'alumni.alumni_id', '=', 'alumni_personal_details.alumni_id')
            ->leftJoin('alumni_academic_details', 'alumni.alumni_id', '=', 'alumni_academic_details.alumni_id')
            ->leftJoin('branches as academic_branches', 'alumni_academic_details.branch_id', '=', 'academic_branches.branch_id')
            ->leftJoin('courses as academic_courses', 'alumni_academic_details.course_id', '=', 'academic_courses.course_id')
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
                'alumni_academic_details.batch as batch',                   // academic_details table
                DB::raw('COALESCE(academic_courses.name, alumni_academic_details.course, academic_courses.code) as course'),
                DB::raw('COALESCE(academic_branches.name, alumni_academic_details.branch) as branch'),
                'alumni.created_at as created_at'                    // keep for default ordering
            ])
            ->whereNotNull('alumni.alumni_id');

        if (!empty($validated['branch'])) {
            $query->where(function ($inner) use ($validated) {
                $inner->where('academic_branches.name', $validated['branch'])
                    ->orWhere(function ($legacy) use ($validated) {
                        $legacy->whereNull('alumni_academic_details.branch_id')
                            ->where('alumni_academic_details.branch', $validated['branch']);
                    });
            });
        }

        if (!empty($validated['school_level'])) {
            $query->where('alumni_academic_details.school_level', $validated['school_level']);
        }

        if (!empty($validated['course'])) {
            $query->where(function ($inner) use ($validated) {
                $inner->where('academic_courses.code', $validated['course'])
                    ->orWhere('academic_courses.name', $validated['course'])
                    ->orWhere(function ($legacy) use ($validated) {
                        $legacy->whereNull('alumni_academic_details.course_id')
                            ->where('alumni_academic_details.course', $validated['course']);
                    });
            });
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
            'branches'    => $this->branchCatalog(),
            'courses'     => Course::query()->with(['branch', 'department'])->orderBy('name')->get(),
            'batches'     => Batch::all(),
            'sortConfig'  => $sortConfig,
        ]);
    }

    public function show(Request $request, $user_name)
    {
        $alumni = $this->findAlumniByUsername($user_name);
        $posts = $this->postsForProfile($request->user()->user_id, $alumni->user_id);

        return Inertia::render('admin/alumni-profile/all', [
            'alumni' => $alumni,
            'posts'  => $posts,
        ]);
    }

    public function show_personal($user_name)
    {
        $alumni = $this->findAlumniByUsername($user_name);

        return Inertia::render('admin/alumni-profile/personal', [
            'alumni' => $alumni,
        ]);
    }


    public function show_academic($user_name)
    {
        $alumni = $this->findAlumniByUsername($user_name);

        return Inertia::render('admin/alumni-profile/academic', [
            'alumni' => $alumni,
        ]);
    }

    public function show_contact($user_name)
    {
        $alumni = $this->findAlumniByUsername($user_name);

        return Inertia::render('admin/alumni-profile/contact', [
            'alumni' => $alumni,
        ]);
    }

    public function show_employment($user_name)
    {
        $alumni = $this->findAlumniByUsername($user_name);

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
            'alumni_academic_details' => session('alumni_academic_details', []),
            'branches' => $this->branchCatalog(),
            'batches' => Batch::query()->orderByDesc('year')->get(),
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
        session(['alumni_academic_details' => $this->hydrateAcademicDetails($request->validated())]);
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

        $password = (
            session('alumni_personal_details')['first_name'][0] .
            session('alumni_personal_details')['middle_name'][0] .
            session('alumni_personal_details')['last_name'][0] .
            '@' . date('Y')
        );

        $alumni = app(CreateAlumni::class)->create([
            'user' => [
                'name' => session('alumni_personal_details')['first_name'] . " " . session('alumni_personal_details')['last_name'] ?? 'No Name',
                'email' => session('alumni_contact_details')['email'],
                'user_type' => 'alumni',
                'password' => $password,
            ],
            'personal' => session('alumni_personal_details', []),
            'academic' => session('alumni_academic_details', []),
            'contact' => session('alumni_contact_details', []),
            'employment' => $request->all(),
        ]);

        // Clear the session data
        session()->forget(['alumni_personal_details', 'alumni_academic_details', 'alumni_contact_details', 'current_step']);


        return redirect()->route('alumni.index')->with([
            'modal_status' => "success",
            'modal_action' => "create",
            'modal_title' => "Create successful!",
            'modal_message' => "Alumni #{$alumni->alumni_id} was added successfully.",
        ]);
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate(['file' => 'required|file']);

        $import = new AlumniImport();
        Excel::import($import, $request->file('file'));

        $importToDb = AlumniImport::importToDbMap();

        // Collection<Failure>
        $rawFailures = $import->failures();

        // Normalize each Failure -> array
        $normalized = $rawFailures->map(function ($f) {
            if ($f instanceof Failure) {
                return [
                    'row' => $f->row(),
                    'attribute' => $f->attribute(),
                    'errors' => $f->errors(),
                    'values' => $f->values(),
                ];
            }
            return (array) $f;
        });

        // Group by row and merge errors/attributes per row
        $failuresByRow = $normalized
            ->groupBy('row')
            ->map(function (Collection $items, $row) use ($importToDb) {
                return [
                    'row' => $row,
                    'errors' => $items->pluck('errors')->flatten(1)->unique()->values()->all(),
                    'attributes' => $items->pluck('attribute')
                        ->map(fn ($attribute) => $importToDb[$attribute] ?? null)
                        ->filter()
                        ->unique()
                        ->values()
                        ->all(),
                    'values' => $items->pluck('values')
                        ->map(function ($values) use ($importToDb) {
                            $dbValues = [];
                            foreach ($importToDb as $importKey => $dbKey) {
                                if (array_key_exists($importKey, $values)) {
                                    $dbValues[$dbKey] = $values[$importKey];
                                }
                            }
                            return $dbValues;
                        })
                        ->all(),
                ];
            })
            ->values()   // reindex numerically
            ->all();     // convert to array for serialization

        // Unique failed rows count
        $failedRowCount = count($failuresByRow);




        $succeeded = $import->getSuccessCount();

        $report = [
            'total' => $succeeded + $failedRowCount,
            'succeeded' => $succeeded,
            'failed' => $failedRowCount,
            'failures' => $failuresByRow,
        ];

        // Notify (payload is JSON-serializable)
        $request->user()->notify(new ImportReportNotification($report));

        return redirect()->route('alumni.index')->with([
            'modal_status' => "success",
            'modal_action' => "create",
            'modal_title' => "Import finished",
            'modal_message' => $report['failed'] > 0
                ? "{$report['succeeded']} of {$report['total']} rows succeeded. {$report['failed']} failed."
                : "Alumni were created successfully. All {$report['total']} rows imported.",
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
        $academicDetails->update($this->hydrateAcademicDetails($request->validated()));

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



    protected function branchCatalog(): Collection
    {
        return Branch::query()
            ->with([
                'departments' => fn ($query) => $query
                    ->orderBy('name')
                    ->with(['courses' => fn ($courseQuery) => $courseQuery->orderBy('name')]),
            ])
            ->orderBy('name')
            ->get();
    }

    protected function findAlumniByUsername(string $userName): Alumni
    {
        return Alumni::with([
            'personal_details',
            'academic_details.branchRelation',
            'academic_details.departmentRelation',
            'academic_details.courseRelation',
            'contact_details',
            'employment_details',
        ])
            ->leftJoin('users', 'alumni.user_id', '=', 'users.user_id')
            ->where('users.user_name', $userName)
            ->where('users.user_type', 'alumni')
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.email', 'users.name')
            ->firstOrFail();
    }

    protected function postsForProfile(int $viewerUserId, int $profileUserId, ?array $statuses = null): Collection
    {
        $query = Post::with(['author', 'attachments'])
            ->where('user_id', $profileUserId)
            ->withCount(['reactions as liked_by_user' => function ($q) use ($viewerUserId) {
                $q->where('user_id', $viewerUserId);
            }])
            ->orderBy('created_at', 'desc');

        if ($statuses !== null) {
            $query->whereIn('status', $statuses);
        }

        return $query->get()->map(function ($post) {
            $post->setAttribute('liked_by_user', (bool) $post->liked_by_user);

            return $post;
        });
    }

    protected function hydrateAcademicDetails(array $validated): array
    {
        $requiresAcademicProgram = in_array($validated['school_level'] ?? '', ['College', 'Graduate'], true);

        if (! $requiresAcademicProgram) {
            $validated['department_id'] = null;
            $validated['course_id'] = null;
        }

        $branch = Branch::query()->find($validated['branch_id']);
        $department = ! empty($validated['department_id'])
            ? Department::query()->find($validated['department_id'])
            : null;
        $course = ! empty($validated['course_id'])
            ? Course::query()->find($validated['course_id'])
            : null;

        if ($course) {
            $department = $department ?: Department::query()->find($course->department_id);
            $branch = $branch ?: Branch::query()->find($course->branch_id);
        }

        if ($department && ! $branch) {
            $branch = Branch::query()->find($department->branch_id);
        }

        return array_merge($validated, [
            'branch_id' => $branch?->branch_id,
            'department_id' => $department?->department_id,
            'course_id' => $course?->course_id,
            'branch' => $branch?->name,
            'course' => $course ? $course->name : null,
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
