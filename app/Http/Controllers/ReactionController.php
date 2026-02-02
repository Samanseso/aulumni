<?php

namespace App\Http\Controllers;

use App\Models\Reaction;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
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
            'user_id' => ['required', 'integer'],
            'type' => ['nullable', Rule::in(['like','love','haha','wow','sad','angry'])],
        ]);

        return DB::transaction(function () use ($data) {
            $post = Post::findOrFail($data['post_id']);

            // If user already reacted, update type; otherwise create
            $reaction = Reaction::where('post_id', $post->post_id)
                ->where('user_id', $data['user_id'])
                ->first();

            if ($reaction) {
                $reaction->type = $data['type'] ?? $reaction->type;
                $reaction->save();
            } else {
                $reaction = Reaction::create([
                    'post_id' => $post->post_id,
                    'user_id' => $data['user_id'],
                    'type' => $data['type'] ?? 'like',
                ]);
                $post->increment('reactions_count');
            }

            return response()->json($reaction, $reaction->wasRecentlyCreated ? 201 : 200);
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
