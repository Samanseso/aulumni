<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::query()->with(['user', 'attachments']);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate(20);
        return Inertia::render('admin/posts', [
            'posts' => $posts,
        ]);
    }

    public function show(Post $post): JsonResponse
    {
        $post->load(['user', 'attachments', 'comments', 'reactions', 'shares']);
        return response()->json($post);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer'],
            'content' => ['required', 'string'],
            'privacy' => ['nullable', Rule::in(['public','friends','only_me'])],
            'attachments' => ['nullable', 'array'],
            'attachments.*.url' => ['required_with:attachments', 'string', 'max:1024'],
            'attachments.*.type' => ['nullable', Rule::in(['image','video','file'])],
        ]);

        return DB::transaction(function () use ($data) {
            $post = Post::create([
                'post_uuid' => (string) Str::uuid(),
                'user_id' => $data['user_id'],
                'content' => $data['content'],
                'privacy' => $data['privacy'] ?? 'public',
            ]);

            if (!empty($data['attachments'])) {
                foreach ($data['attachments'] as $att) {
                    Attachment::create([
                        'post_id' => $post->post_id,
                        'url' => $att['url'],
                        'type' => $att['type'] ?? 'image',
                    ]);
                }
            }

            return response()->json($post->load('attachments'), 201);
        });
    }

    public function approve(Post $post): RedirectResponse 
    {
        $post->status = 'approved';
        $post->save();

        return back()->with([
            'modal_status'  => 'success',
            'modal_action'  => 'update',
            'modal_title'   => 'Approval successful!',
            'modal_message' => 'Post was approved successfully.',
        ]);
    }


    public function reject(Post $post): RedirectResponse 
    {
        $post->status = 'rejected';
        $post->save();

        return back()->with([
            'modal_status'  => 'success',
            'modal_action'  => 'update',
            'modal_title'   => 'Rejection successful!',
            'modal_message' => 'Post was rejected successfully.',
        ]);
    }

    public function update(Request $request, Post $post): JsonResponse
    {
        $data = $request->validate([
            'content' => ['sometimes', 'string'],
            'privacy' => ['nullable', Rule::in(['public','friends','only_me'])],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $post->update($data);

        return response()->json($post);
    }

    public function destroy(Post $post): JsonResponse
    {
        $post->delete();
        return response()->json(null, 204);
    }
}
