<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Alumni;
use App\Models\AlumniPersonalDetails;
use App\Models\Post;
use App\Support\AdminDashboardReportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request, AdminDashboardReportService $dashboardReportService)
    {
        if (Auth::check()) {
            // Redirect to email verification if not verified
            $user = Auth::user();
            if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail()) {
                return redirect()->route('verification.notice');
            }

            switch ($user->user_type) {
                case 'admin':
                    return Inertia::render('admin/dashboard', $dashboardReportService->build());
                case 'employee':
                    return Inertia::render('employee/dashboard');
                case 'alumni':
                    return $this->show_posts($request);
                default:
                    abort(403, 'Unauthorized');
            }
        }

        return redirect()->route('login');
    }

    public function show_posts(Request $request)
    {

        $user_id = $request->user()->user_id;
        $viewerProfile = $this->findAlumniByUserId($user_id);
        $posts = $this->approvedPostsForViewer($user_id);
        $announcements = $this->approvedAnnouncements();

        return Inertia::render('alumni/news-feed', [
            'posts' => $posts,
            'announcements' => $announcements,
            'viewerProfile' => $viewerProfile,
            'feedSummary' => [
                'profile_completion' => $this->calculateProfileCompletion($viewerProfile),
                'approved_posts' => Post::query()->where('status', 'approved')->count(),
                'approved_announcements' => Announcement::query()->where('status', 'approved')->count(),
                'upcoming_events' => Announcement::query()
                    ->where('status', 'approved')
                    ->where('starts_at', '>=', now())
                    ->count(),
                'companies_hiring' => Post::query()
                    ->where('status', 'approved')
                    ->whereNotNull('company')
                    ->distinct()
                    ->count('company'),
                'unread_notifications' => $request->user()->unreadNotifications()->count() ?? 0,
            ],
        ]);
    }

    public function show_profile(Request $request, $user_name)
    {
        $alumni = $this->findAlumniByUsername($user_name);

        return Inertia::render('alumni/profile', [
            'alumni' => $alumni,
            'posts' => $this->approvedPostsForViewer($request->user()->user_id, $alumni->user_id),
            'isOwnProfile' => $request->user()->user_id === $alumni->user_id,
        ]);
    }

    public function updateProfilePhoto(Request $request): RedirectResponse
    {
        $user = $request->user();

        abort_if(! $user || $user->user_type !== 'alumni', 403);

        $validated = $request->validate([
            'photo' => ['required', 'image', 'max:3072'],
        ]);

        $alumni = Alumni::query()
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        $personalDetails = AlumniPersonalDetails::query()->firstOrNew([
            'alumni_id' => $alumni->alumni_id,
        ]);

        $previousPhotos = collect([$personalDetails->photo, $user->avatar])
            ->filter()
            ->unique()
            ->all();

        $path = $validated['photo']->store('profile-photos/' . date('Y/m'), 'public');
        $photoUrl = url('storage/' . $path);

        $personalDetails->photo = $photoUrl;
        $personalDetails->save();

        $user->forceFill([
            'avatar' => $photoUrl,
        ])->save();

        foreach ($previousPhotos as $previousPhoto) {
            if ($previousPhoto !== $photoUrl) {
                $this->deleteStoredProfilePhoto($previousPhoto);
            }
        }

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Profile photo updated',
            'modal_message' => 'Your profile picture was updated successfully.',
        ]);
    }

    public function show_profile_personal(Request $request, string $user_name)
    {
        return $this->renderPublicProfile($request, $user_name, 'alumni/profile-personal');
    }

    public function show_profile_academic(Request $request, string $user_name)
    {
        return $this->renderPublicProfile($request, $user_name, 'alumni/profile-academic');
    }

    public function show_profile_contact(Request $request, string $user_name)
    {
        return $this->renderPublicProfile($request, $user_name, 'alumni/profile-contact');
    }

    public function show_profile_employment(Request $request, string $user_name)
    {
        return $this->renderPublicProfile($request, $user_name, 'alumni/profile-employment');
    }

    protected function approvedPostsForViewer(int $viewerUserId, ?int $profileUserId = null)
    {
        $query = Post::with(['author', 'attachments'])
            ->where('status', 'approved')
            ->withCount(['reactions as liked_by_user' => function ($q) use ($viewerUserId) {
                $q->where('user_id', $viewerUserId);
            }])
            ->orderBy('created_at', 'desc');

        if ($profileUserId !== null) {
            $query->where('user_id', $profileUserId);
        }

        return $query->get()->map(function ($post) {
            $post->setAttribute('liked_by_user', (bool) $post->liked_by_user);

            return $post;
        });
    }

    protected function approvedAnnouncements()
    {
        return Announcement::query()
            ->with(['author', 'attachments'])
            ->where('status', 'approved')
            ->orderBy('starts_at')
            ->orderByDesc('created_at')
            ->get();
    }

    protected function renderPublicProfile(Request $request, string $userName, string $component, array $extraProps = [])
    {
        $alumni = $this->findAlumniByUsername($userName);

        return Inertia::render($component, array_merge([
            'alumni' => $alumni,
            'isOwnProfile' => $request->user()->user_id === $alumni->user_id,
        ], $extraProps));
    }

    protected function findAlumniByUserId(int $userId): ?Alumni
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
            ->where('alumni.user_id', $userId)
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.email', 'users.name', 'users.avatar')
            ->first();
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
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.email', 'users.name', 'users.avatar')
            ->firstOrFail();
    }

    protected function deleteStoredProfilePhoto(?string $photoUrl): void
    {
        if (! filled($photoUrl)) {
            return;
        }

        $path = parse_url($photoUrl, PHP_URL_PATH);

        if (! is_string($path) || ! str_starts_with($path, '/storage/')) {
            return;
        }

        Storage::disk('public')->delete(Str::after($path, '/storage/'));
    }

    protected function calculateProfileCompletion(?Alumni $alumni): int
    {
        if (! $alumni) {
            return 0;
        }

        $fields = [
            $alumni->personal_details?->bio,
            $alumni->personal_details?->address,
            $alumni->academic_details?->school_level,
            $alumni->academic_details?->branch,
            $alumni->academic_details?->course,
            $alumni->contact_details?->contact,
            $alumni->contact_details?->email ?: $alumni->email,
            $alumni->employment_details?->current_employed,
            $alumni->employment_details?->current_work_company,
        ];

        $completedFields = collect($fields)
            ->filter(fn($value) => filled($value))
            ->count();

        return (int) round(($completedFields / count($fields)) * 100);
    }


    public function show_find_job(Request $request)
    {
        $user_id = $request->user()->user_id;

        $viewerProfile = $this->findAlumniByUserId($user_id);
        $posts = $this->approvedPostsForViewer($user_id);
        $announcements = $this->approvedAnnouncements();

        return Inertia::render('alumni/find-job', [
            'announcements' => $announcements,
            'viewerProfile' => $viewerProfile,
            'feedSummary' => [
                'profile_completion' => $this->calculateProfileCompletion($viewerProfile),
                'approved_posts' => Post::query()->where('status', 'approved')->count(),
                'approved_announcements' => Announcement::query()->where('status', 'approved')->count(),
                'upcoming_events' => Announcement::query()
                    ->where('status', 'approved')
                    ->where('starts_at', '>=', now())
                    ->count(),
                'companies_hiring' => Post::query()
                    ->where('status', 'approved')
                    ->whereNotNull('company')
                    ->distinct()
                    ->count('company'),
                'unread_notifications' => $request->user()->unreadNotifications()->count() ?? 0,
            ],
        ]);
    }

    public function show_saved_job(Request $request)
    {
        $user_id = $request->user()->user_id;

        $viewerProfile = $this->findAlumniByUserId($user_id);
        $posts = $this->approvedPostsForViewer($user_id);
        $announcements = $this->approvedAnnouncements();

        return Inertia::render('alumni/saved-job', [
            'announcements' => $announcements,
            'viewerProfile' => $viewerProfile,
            'feedSummary' => [
                'profile_completion' => $this->calculateProfileCompletion($viewerProfile),
                'approved_posts' => Post::query()->where('status', 'approved')->count(),
                'approved_announcements' => Announcement::query()->where('status', 'approved')->count(),
                'upcoming_events' => Announcement::query()
                    ->where('status', 'approved')
                    ->where('starts_at', '>=', now())
                    ->count(),
                'companies_hiring' => Post::query()
                    ->where('status', 'approved')
                    ->whereNotNull('company')
                    ->distinct()
                    ->count('company'),
                'unread_notifications' => $request->user()->unreadNotifications()->count() ?? 0,
            ],
        ]);
    }
}
