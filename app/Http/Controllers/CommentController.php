<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Comment::with('user')->orderBy('created_at', 'asc');
        if ($request->filled('post_id')) {
            $query->where('post_id', $request->input('post_id'));
        }
        if ($request->filled('parent_comment_id')) {
            $query->where('parent_comment_id', $request->input('parent_comment_id'));
        }
        $comments = $query->paginate(30);
        return response()->json($comments);
    }

    public function show(Comment $comment): JsonResponse
    {
        $comment->load(['user', 'children']);
        return response()->json($comment);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'post_id' => ['required', 'integer'],
            'user_id' => ['required', 'integer'],
            'parent_comment_id' => ['nullable', 'integer'],
            'content' => ['required', 'string'],
        ]);

        return DB::transaction(function () use ($data) {
            $post = Post::findOrFail($data['post_id']);

            $comment = Comment::create([
                'post_id' => $post->post_id,
                'user_id' => $data['user_id'],
                'parent_comment_id' => $data['parent_comment_id'] ?? null,
                'content' => $data['content'],
            ]);

            // increment post comments_count
            $post->increment('comments_count');

            // if reply, increment parent's reply_count
            if ($comment->parent_comment_id) {
                Comment::where('comment_id', $comment->parent_comment_id)->increment('reply_count');
            }

            return response()->json($comment->load('user'), 201);
        });
    }

    public function update(Request $request, Comment $comment): JsonResponse
    {
        $data = $request->validate([
            'content' => ['required', 'string'],
        ]);

        $comment->content = $data['content'];
        $comment->is_edited = 1;
        $comment->save();

        return response()->json($comment);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        return DB::transaction(function () use ($comment) {
            // decrement counters if not a soft delete scenario handled elsewhere
            $post = Post::find($comment->post_id);
            if ($post) {
                $post->decrement('comments_count');
            }

            if ($comment->parent_comment_id) {
                Comment::where('comment_id', $comment->parent_comment_id)->decrement('reply_count');
            }

            $comment->delete();

            return response()->json(null, 204);
        });
    }
}
