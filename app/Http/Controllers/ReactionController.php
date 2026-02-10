<?php

namespace App\Http\Controllers;

use App\Models\Reaction;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ReactionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Reaction::query();
        if ($request->filled('post_id')) {
            $query->where('post_id', $request->input('post_id'));
        }
        $reactions = $query->paginate(50);
        return response()->json($reactions);
    }


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
            // Lock the post row to avoid concurrent counter issues
            $post = Post::where('post_id', $data['post_id'])->lockForUpdate()->firstOrFail();

            // Find existing reaction for this user and post
            $reaction = Reaction::where('post_id', $post->post_id)
                ->where('user_id', $userId)
                ->first();

            if ($reaction) {
                // Delete existing reaction
                $reaction->delete();

                // Decrement counter (ensure it doesn't go below zero)
                if ($post->reactions_count > 0) {
                    $post->decrement('reactions_count');
                }

                return response()->json([
                    'action' => 'deleted',
                    'reaction_id' => $reaction->id ?? null,
                    'reactions_count' => $post->fresh()->reactions_count,
                ], 200);
            }

            // Create new reaction
            $newReaction = Reaction::create([
                'post_id' => $post->post_id,
                'user_id' => $userId,
            ]);

            // Increment counter
            $post->increment('reactions_count');

            return response()->json([
                'action' => 'created',
                'reaction' => $newReaction,
                'reactions_count' => $post->fresh()->reactions_count,
            ], 201);
        });
    }



    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'post_id' => ['required', 'integer'],
            'user_id' => ['required', 'integer'],
        ]);

        return DB::transaction(function () use ($data) {
            $reaction = Reaction::where('post_id', $data['post_id'])->where('user_id', $data['user_id'])->first();
            if ($reaction) {
                $reaction->delete();
                Post::where('post_id', $data['post_id'])->decrement('reactions_count');
                return response()->json(null, 204);
            }
            return response()->json(['message' => 'Not found'], 404);
        });
    }
}
