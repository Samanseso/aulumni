<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::check()) {
            switch (Auth::user()->user_type) {
                case 'admin':
                    return Inertia::render('admin/dashboard');
                case 'employee':
                    return Inertia::render('employee/dashboard');
                case 'alumni':
                    return $this->show_posts($request->user()->user_id);
                default:
                    abort(403, 'Unauthorized');
            }
        }

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }

    public function show_posts($user_id)
    {
        $posts = Post::with(['author', 'attachments'])
            ->where('status', 'approved')
            ->withCount(['reactions as liked_by_user' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        $posts = $posts->map(function ($post) {
            $post->setAttribute('liked_by_user', (bool) $post->liked_by_user);

            return $post;
        });

        return Inertia::render('alumni/news-feed', [
            'posts' => $posts,
        ]);
    }

    public function show_profile($user_name)
    {
        if ($user_name === 'notifications') {
            return redirect()->route('notifications.index');
        }

        return Inertia::render('alumni/profile');
    }
}
