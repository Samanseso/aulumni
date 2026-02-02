<?php

namespace App\Http\Controllers;

use App\Models\Share;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ShareController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Share::query();
        if ($request->filled('post_id')) {
            $query->where('post_id', $request->input('post_id'));
        }
        $shares = $query->paginate(30);
        return response()->json($shares);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'post_id' => ['required', 'integer'],
            'user_id' => ['required', 'integer'],
            'comment' => ['nullable', 'string', 'max:512'],
        ]);

        return DB::transaction(function () use ($data) {
            $post = Post::findOrFail($data['post_id']);

            $share = Share::create([
                'post_id' => $post->post_id,
                'user_id' => $data['user_id'],
                'comment' => $data['comment'] ?? null,
            ]);

            // increment shares_count if you track it on posts
            if (Schema::hasColumn('posts', 'shares_count')) {
                $post->increment('shares_count');
            }

            return response()->json($share, 201);
        });
    }

    public function destroy(Share $share): JsonResponse
    {
        $share->delete();
        if (Schema::hasColumn('posts', 'shares_count')) {
            Post::where('post_id', $share->post_id)->decrement('shares_count');
        }
        return response()->json(null, 204);
    }
}
