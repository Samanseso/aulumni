<?php

namespace App\Http\Controllers;

use App\Actions\Alumni\CreateAlumni;
use App\Http\Requests\EmploymentSurveySignupRequest;
use App\Models\Alumni;
use App\Models\AlumniAcademicDetails;
use App\Models\AlumniContactDetails;
use App\Models\AlumniEmploymentDetails;
use App\Models\AlumniPersonalDetails;
use App\Models\Batch;
use App\Models\Branch;
use App\Models\Course;
use App\Models\Department;
use App\Models\User;
use App\Notifications\EmploymentSurveySubmittedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EmploymentSurveyController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        $alumni = $request->user()
            ? Alumni::query()
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
                ->firstOrFail()
            : null;

        return Inertia::render('alumni/employment-survey', [
            'alumni' => $alumni,
            'branches' => $this->branchCatalog(),
            'batches' => Batch::query()->orderByDesc('year')->get(),
            'is_signup' => $request->user() === null,
        ]);
    }

    public function store(EmploymentSurveySignupRequest $request): RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        $validated = $request->validated();
        $personal = $this->personalPayload($validated);
        $academic = $this->hydrateAcademicDetails($this->academicPayload($validated));
        $contact = $this->contactPayload($validated);
        $employment = $this->employmentPayload($validated);

        if (!$request->user()) {
            $alumni = app(CreateAlumni::class)->create([
                'user' => [
                    'name' => trim($validated['first_name'] . ' ' . $validated['last_name']),
                    'email' => $validated['email'],
                    'user_type' => 'alumni',
                    'password' => $validated['password'],
                    'status' => 'pending',
                    'survey_completed' => true,
                ],
                'personal' => $personal,
                'academic' => $academic,
                'contact' => $contact,
                'employment' => $employment,
            ]);

            $this->notifyAdminsAboutNewAccount($alumni);

            return redirect()->route('login')->with('status', 'Your alumni survey was submitted successfully. You can log in using your email and password once your account is ready.');
        }

        $user = $request->user();
        $alumni = Alumni::query()
            ->where('user_id', $user->user_id)
            ->firstOrFail();
        $shouldNotifyAdmins = $this->shouldNotifyAdminsAboutSurveySubmission($user, $alumni);

        $user->update([
            'name' => trim($validated['first_name'] . ' ' . $validated['last_name']),
            'email' => $validated['email'],
            'survey_completed' => true,
        ]);

        AlumniPersonalDetails::query()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($personal, ['alumni_id' => $alumni->alumni_id]),
        );

        AlumniAcademicDetails::query()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($academic, ['alumni_id' => $alumni->alumni_id]),
        );

        AlumniContactDetails::query()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($contact, ['alumni_id' => $alumni->alumni_id]),
        );

        AlumniEmploymentDetails::query()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($employment, ['alumni_id' => $alumni->alumni_id]),
        );

        if ($shouldNotifyAdmins) {
            $this->notifyAdminsAboutNewAccount($alumni);
        }

        return redirect()->route('home')->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Survey submitted',
            'modal_message' => 'Your alumni survey was saved successfully.',
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

    protected function personalPayload(array $validated): array
    {
        return collect($validated)->only([
            'first_name',
            'middle_name',
            'last_name',
            'birthday',
            'gender',
            'photo',
            'bio',
            'interest',
            'address',
        ])->all();
    }

    protected function academicPayload(array $validated): array
    {
        return collect($validated)->only([
            'student_number',
            'school_level',
            'batch',
            'branch_id',
            'department_id',
            'course_id',
        ])->all();
    }

    protected function contactPayload(array $validated): array
    {
        return collect($validated)->only([
            'email',
            'contact',
            'telephone',
            'mailing_address',
            'present_address',
            'provincial_address',
            'company_address',
            'facebook_url',
            'twitter_url',
            'gmail_url',
            'link_url',
            'other_url',
        ])->all();
    }

    protected function employmentPayload(array $validated): array
    {
        return collect($validated)->only([
            'first_work_position',
            'first_work_time_taken',
            'first_work_acquisition',
            'current_employed',
            'current_work_type',
            'current_work_status',
            'current_work_company',
            'current_work_position',
            'current_work_years',
            'current_work_monthly_income',
            'current_work_satisfaction',
            'au_skills',
            'au_usefulness',
        ])->all();
    }

    // Step-based survey methods
    public function personal(Request $request): Response|RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        return Inertia::render('alumni/survey/personal', [
            'is_signup' => $request->user() === null,
            'personal' => $request->session()->get('survey_personal', $this->personalDefaults($request)),
        ]);
    }

    public function storePersonal(Request $request): RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        $userId = $request->user()?->user_id;

        $validated = $request->validate([
            'email' => [
                $userId === null ? 'required' : 'nullable',
                'email',
                $userId === null
                    ? Rule::unique(User::class)
                    : Rule::unique(User::class)->ignore($userId, 'user_id'),
            ],
            'password' => [$userId === null ? 'required' : 'nullable', 'min:8'],
            'password_confirmation' => [$userId === null ? 'required' : 'nullable', 'same:password'],
            'first_name' => 'required|string',
            'middle_name' => 'required|string',
            'last_name' => 'required|string',
            'birthday' => 'required|date',
            'gender' => 'required|in:Male,Female,Other',
            'photo' => 'nullable|url',
            'bio' => 'nullable|string',
            'interest' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $request->session()->put('survey_personal', $validated);

        return redirect()->route('survey.academic');
    }

    public function academic(Request $request): Response|RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        return Inertia::render('alumni/survey/academic', [
            'branches' => $this->branchCatalog(),
            'batches' => Batch::query()->orderByDesc('year')->get(),
            'academic' => $request->session()->get('survey_academic', $this->academicDefaults($request)),
        ]);
    }

    public function storeAcademic(Request $request): RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        $validated = $request->validate([
            'student_number' => 'required|string',
            'school_level' => 'required|in:College,Graduate',
            'batch' => 'required|digits:4|integer',
            'branch_id' => 'required|integer|exists:branches,branch_id',
            'department_id' => 'nullable|integer|exists:departments,department_id',
            'course_id' => 'nullable|integer|exists:courses,course_id',
        ]);

        $academic = $this->hydrateAcademicDetails($validated);
        $request->session()->put('survey_academic', $academic);

        return redirect()->route('survey.contact');
    }

    public function contact(Request $request): Response|RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        return Inertia::render('alumni/survey/contact', [
            'contact' => $request->session()->get('survey_contact', $this->contactDefaults($request)),
        ]);
    }

    public function storeContact(Request $request): RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        $validated = $request->validate([
            'email_address' => 'required|email',
            'mobile_number' => 'required|string',
            'landline_number' => 'nullable|string',
            'telephone_extension' => 'nullable|string',
            'complete_address' => 'required|string',
        ]);

        $request->session()->put('survey_contact', $validated);

        return redirect()->route('survey.employment');
    }

    public function employment(Request $request): Response|RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        return Inertia::render('alumni/survey/employment', [
            'employment' => $request->session()->get('survey_employment', $this->employmentDefaults($request)),
        ]);
    }

    public function storeEmployment(Request $request): RedirectResponse
    {
        if ($redirect = $this->redirectIfSurveyUnavailable($request)) {
            return $redirect;
        }

        $validated = $request->validate([
            'current_employed' => 'required|string',
            'current_company_name' => 'nullable|string',
            'current_job_position' => 'nullable|string',
            'organization_type' => 'nullable|string',
            'work_status' => 'nullable|string',
            'work_year' => 'nullable|string',
            'monthly_income' => 'nullable|string',
            'job_satisfaction' => 'nullable|string',
            'has_first_job' => 'nullable|string',
            'first_work_position' => 'nullable|string',
            'first_work_time_taken' => 'nullable|string',
            'first_work_acquisition' => 'nullable|string',
            'course_usefulness' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $request->session()->put('survey_employment', $validated);

        $personalData = $request->session()->get('survey_personal', []);
        $academicData = $request->session()->get('survey_academic', []);
        $contactData = $request->session()->get('survey_contact', []);
        $employmentData = $request->session()->get('survey_employment', []);

        if ($redirect = $this->ensureSurveyStepData($personalData, $academicData, $contactData)) {
            return $redirect;
        }

        $personalPayload = $this->personalPayload($personalData);
        $academicPayload = $this->hydrateAcademicDetails($academicData);
        $contactPayload = $this->contactPayloadFromStep($contactData);
        $employmentPayload = $this->employmentPayloadFromStep($employmentData);
        $fullName = $this->fullNameFromPersonalData($personalData, $request->user()?->name);
        $surveyEmail = $personalData['email'] ?? $contactPayload['email'] ?? $request->user()?->email;

        if (! $request->user()) {
            if (! filled($personalData['email'] ?? null) || ! filled($personalData['password'] ?? null)) {
                return redirect()->route('survey.personal');
            }

            $alumni = app(CreateAlumni::class)->create([
                'user' => [
                    'name' => $fullName,
                    'email' => $surveyEmail,
                    'user_type' => 'alumni',
                    'password' => $personalData['password'],
                    'status' => 'pending',
                    'survey_completed' => true,
                ],
                'personal' => $personalPayload,
                'academic' => $academicPayload,
                'contact' => $contactPayload,
                'employment' => $employmentPayload,
            ]);

            $this->notifyAdminsAboutNewAccount($alumni);

            $request->session()->forget(['survey_personal', 'survey_academic', 'survey_contact', 'survey_employment']);

            return redirect()->route('login')->with('status', 'Your alumni survey was submitted successfully. You can log in using your email and password once your account is ready.');
        }

        $user = $request->user();
        $alumni = Alumni::query()
            ->where('user_id', $user->user_id)
            ->first();
        $shouldNotifyAdmins = $this->shouldNotifyAdminsAboutSurveySubmission($user, $alumni);

        if (! $alumni) {
            $alumni = Alumni::query()->create([
                'alumni_id' => $this->nextAlumniId(),
                'user_id' => $user->user_id,
            ]);
        }

        $user->update([
            'name' => $fullName,
            'email' => $surveyEmail ?? $user->email,
            'survey_completed' => true,
        ]);

        AlumniPersonalDetails::query()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($personalPayload, ['alumni_id' => $alumni->alumni_id]),
        );

        AlumniAcademicDetails::query()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($academicPayload, ['alumni_id' => $alumni->alumni_id]),
        );

        AlumniContactDetails::query()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($contactPayload, ['alumni_id' => $alumni->alumni_id]),
        );

        AlumniEmploymentDetails::query()->updateOrCreate(
            ['alumni_id' => $alumni->alumni_id],
            array_merge($employmentPayload, ['alumni_id' => $alumni->alumni_id]),
        );

        if ($shouldNotifyAdmins) {
            $this->notifyAdminsAboutNewAccount($alumni);
        }

        $request->session()->forget(['survey_personal', 'survey_academic', 'survey_contact', 'survey_employment']);

        return redirect()->route('home')->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Account Created',
            'modal_message' => 'Welcome to Arellano University Alumni Tracking.',
        ]);
    }

    protected function contactPayloadFromStep(array $validated): array
    {
        $telephone = trim(implode(' ', array_filter([
            $validated['landline_number'] ?? null,
            filled($validated['telephone_extension'] ?? null)
                ? 'ext. '.$validated['telephone_extension']
                : null,
        ])));

        return array_filter([
            'email' => $validated['email_address'] ?? null,
            'contact' => $validated['mobile_number'] ?? null,
            'telephone' => $telephone !== '' ? $telephone : null,
            'mailing_address' => $validated['complete_address'] ?? null,
            'present_address' => $validated['complete_address'] ?? null,
        ], fn ($value) => $value !== null && $value !== '');
    }

    protected function employmentPayloadFromStep(array $validated): array
    {
        return array_filter([
            'current_employed' => $validated['current_employed'] ?? null,
            'current_work_company' => $validated['current_company_name'] ?? null,
            'current_work_position' => $validated['current_job_position'] ?? null,
            'current_work_type' => $validated['organization_type'] ?? null,
            'current_work_status' => $validated['work_status'] ?? null,
            'current_work_years' => $validated['work_year'] ?? null,
            'current_work_monthly_income' => $validated['monthly_income'] ?? null,
            'current_work_satisfaction' => $validated['job_satisfaction'] ?? null,
            'first_work_position' => $validated['first_work_position'] ?? null,
            'first_work_time_taken' => $validated['first_work_time_taken'] ?? null,
            'first_work_acquisition' => $validated['first_work_acquisition'] ?? null,
            'au_usefulness' => $validated['course_usefulness'] ?? null,
            'remarks' => $validated['remarks'] ?? null,
        ], fn ($value) => $value !== null && $value !== '');
    }

    protected function personalDefaults(Request $request): array
    {
        $user = $request->user();
        $alumni = $this->currentAlumni($request);

        return array_filter([
            'first_name' => $alumni?->personal_details?->first_name,
            'middle_name' => $alumni?->personal_details?->middle_name,
            'last_name' => $alumni?->personal_details?->last_name,
            'birthday' => $alumni?->personal_details?->birthday,
            'gender' => $alumni?->personal_details?->gender,
            'photo' => $user?->avatar,
            'bio' => $alumni?->personal_details?->bio,
            'interest' => $alumni?->personal_details?->interest,
            'address' => $alumni?->personal_details?->address,
            'email' => $user?->email,
        ], fn ($value) => $value !== null && $value !== '');
    }

    protected function academicDefaults(Request $request): array
    {
        $academic = $this->currentAlumni($request)?->academic_details;

        return array_filter([
            'student_number' => $academic?->student_number,
            'school_level' => $academic?->school_level,
            'batch' => $academic?->batch,
            'branch_id' => $academic?->branch_id,
            'department_id' => $academic?->department_id,
            'course_id' => $academic?->course_id,
        ], fn ($value) => $value !== null && $value !== '');
    }

    protected function contactDefaults(Request $request): array
    {
        $contact = $this->currentAlumni($request)?->contact_details;

        return array_filter([
            'email_address' => $contact?->email ?? $request->user()?->email,
            'mobile_number' => $contact?->contact,
            'landline_number' => $contact?->telephone,
            'complete_address' => $contact?->present_address ?? $contact?->mailing_address,
        ], fn ($value) => $value !== null && $value !== '');
    }

    protected function employmentDefaults(Request $request): array
    {
        $employment = $this->currentAlumni($request)?->employment_details;

        return array_filter([
            'current_employed' => $employment?->current_employed,
            'current_company_name' => $employment?->current_work_company,
            'current_job_position' => $employment?->current_work_position,
            'organization_type' => $employment?->current_work_type,
            'work_status' => $employment?->current_work_status,
            'work_year' => $employment?->current_work_years,
            'monthly_income' => $employment?->current_work_monthly_income,
            'job_satisfaction' => $employment?->current_work_satisfaction,
            'first_work_position' => $employment?->first_work_position,
            'first_work_time_taken' => $employment?->first_work_time_taken,
            'first_work_acquisition' => $employment?->first_work_acquisition,
            'course_usefulness' => $employment?->au_usefulness,
            'remarks' => $employment?->remarks,
            'has_first_job' => filled($employment?->first_work_position) ? 'Yes' : 'No',
        ], fn ($value) => $value !== null && $value !== '');
    }

    protected function currentAlumni(Request $request): ?Alumni
    {
        if (! $request->user()) {
            return null;
        }

        return Alumni::query()
            ->with([
                'personal_details',
                'academic_details',
                'contact_details',
                'employment_details',
            ])
            ->where('user_id', $request->user()->user_id)
            ->first();
    }

    protected function redirectIfSurveyUnavailable(Request $request): ?RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return null;
        }

        if ($user->user_type !== 'alumni') {
            return redirect()->route('home');
        }

        return null;
    }

    protected function ensureSurveyStepData(array $personalData, array $academicData, array $contactData): ?RedirectResponse
    {
        if (! filled($personalData['first_name'] ?? null) || ! filled($personalData['last_name'] ?? null)) {
            return redirect()->route('survey.personal');
        }

        if (! filled($academicData['student_number'] ?? null)) {
            return redirect()->route('survey.academic');
        }

        if (! filled($contactData['email_address'] ?? null) || ! filled($contactData['mobile_number'] ?? null)) {
            return redirect()->route('survey.contact');
        }

        return null;
    }

    protected function fullNameFromPersonalData(array $personalData, ?string $fallback = null): string
    {
        $fullName = trim(implode(' ', array_filter([
            $personalData['first_name'] ?? null,
            $personalData['middle_name'] ?? null,
            $personalData['last_name'] ?? null,
        ])));

        return $fullName !== '' ? $fullName : ($fallback ?: 'No Name');
    }

    /**
     * @return array{0: string|null, 1: string|null, 2: string|null}
     */
    protected function splitDisplayName(?string $name): array
    {
        $parts = preg_split('/\s+/', trim((string) $name)) ?: [];

        if (count($parts) <= 1) {
            return [$parts[0] ?? null, null, null];
        }

        if (count($parts) === 2) {
            return [$parts[0], null, $parts[1]];
        }

        return [
            $parts[0],
            implode(' ', array_slice($parts, 1, -1)) ?: null,
            $parts[count($parts) - 1] ?? null,
        ];
    }

    protected function notifyAdminsAboutNewAccount(Alumni $alumni): void
    {
        $alumni->loadMissing([
            'user',
            'personal_details',
            'academic_details',
            'contact_details',
            'employment_details',
        ]);

        User::query()
            ->where('user_type', 'admin')
            ->get()
            ->each(fn (User $admin) => $admin->notify(new EmploymentSurveySubmittedNotification($alumni)));
    }

    protected function shouldNotifyAdminsAboutSurveySubmission(User $user, ?Alumni $alumni): bool
    {
        if ($user->status !== 'pending') {
            return false;
        }

        if (! $user->survey_completed) {
            return true;
        }

        if (! $alumni) {
            return true;
        }

        return ! DB::table('notifications')
            ->where('type', EmploymentSurveySubmittedNotification::class)
            ->where('data->alumni_id', $alumni->alumni_id)
            ->exists();
    }

    protected function nextAlumniId(): string
    {
        $prefix = date('y').'-';

        $max = Alumni::query()
            ->where('alumni_id', 'like', $prefix.'%')
            ->selectRaw('MAX(CAST(SUBSTRING(alumni_id, 4) AS UNSIGNED)) as max_seq')
            ->value('max_seq') ?? 0;

        return $prefix.sprintf('%05d', $max + 1);
    }
}
