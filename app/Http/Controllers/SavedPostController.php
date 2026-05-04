<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\SavedPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SavedPostController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'post_id' => ['required', 'integer'],
        ]);

        $userId = $request->user()->user_id;
        if (! $userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return DB::transaction(function () use ($data, $userId) {
            $post = Post::where('post_id', $data['post_id'])->lockForUpdate()->firstOrFail();

            $savedPost = SavedPost::query()
                ->where('post_id', $post->post_id)
                ->where('user_id', $userId)
                ->first();

            if ($savedPost) {
                $savedPost->delete();

                return response()->json([
                    'action' => 'deleted',
                    'saved_post_id' => $savedPost->saved_post_id,
                ], 200);
            }

            $newSavedPost = SavedPost::create([
                'post_id' => $post->post_id,
                'user_id' => $userId,
            ]);

            return response()->json([
                'action' => 'created',
                'saved_post' => $newSavedPost,
            ], 201);
        });
    }
}
