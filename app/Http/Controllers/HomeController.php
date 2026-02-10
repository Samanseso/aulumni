<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
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
        // Get posts (adjust query to your needs: all posts, user feed, paginated, etc.)
        $posts = Post::with(['author', 'attachments', 'comments.user:user_id,user_name,name,email', 'shares'])
            ->withCount(['reactions as liked_by_user' => function ($q) use ($user_id) {
                $q->where('user_id', $user_id);
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        // Convert liked_by_user from 0/1 to boolean and optionally add reaction_type
        $posts = $posts->map(function ($post) use ($user_id) {
            $post->setAttribute('liked_by_user', (bool) $post->liked_by_user);

            return $post;
        });

        return Inertia::render('alumni/news-feed', [
            'posts' => $posts,
        ]);
    }
}
