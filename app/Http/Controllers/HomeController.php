<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Alumni;
use App\Models\Post;
use App\Support\AdminDashboardReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request, AdminDashboardReportService $dashboardReportService)
    {
        if (Auth::check()) {
            switch (Auth::user()->user_type) {
                case 'admin':
                    return Inertia::render('admin/dashboard', $dashboardReportService->build());
                case 'employee':
                    return Inertia::render('employee/dashboard');
                case 'alumni':
                    return $this->show_posts($request->user()->user_id);
                default:
                    abort(403, 'Unauthorized');
            }
        }

        return redirect()->route('login');
    }

    public function show_posts($user_id)
    {
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
                'unread_notifications' => Auth::user()?->unreadNotifications()->count() ?? 0,
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
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.email', 'users.name')
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
            ->select('alumni.*', 'users.status', 'users.user_name', 'users.email', 'users.name')
            ->firstOrFail();
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
            ->filter(fn ($value) => filled($value))
            ->count();

        return (int) round(($completedFields / count($fields)) * 100);
    }
}
