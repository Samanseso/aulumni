<?php

namespace App\Http\Controllers;

use App\Events\PostsUpdated;
use App\Http\Requests\PostRequest;
use App\Models\Post;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'integer'],
            'privacy' => ['nullable', Rule::in(['public', 'friends', 'only_me'])],
            'status' => ['nullable', Rule::in(['pending', 'approved', 'rejected'])],
            'search' => ['nullable', 'string', 'max:255'],
            'rows' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Post::query()->with(['author', 'attachments']);

        if (! empty($validated['user_id'])) {
            $query->where('user_id', $validated['user_id']);
        }

        if (! empty($validated['privacy'])) {
            $query->where('privacy', $validated['privacy']);
        }

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (! empty($validated['search'])) {
            $search = trim($validated['search']);
            $query->where(function ($inner) use ($search) {
                $inner->where('job_title', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate($validated['rows'] ?? 20)->withQueryString();
        return Inertia::render('admin/posts', [
            'posts' => $posts,
        ]);
    }

    public function show(Post $post): JsonResponse
    {
        $post = Post::with([
            'author',
            'attachments',
            'reactions',
        ])
            ->where('post_id', $post->post_id)
            ->firstOrFail();


        return response()->json($post);
    }

    public function retrieve($post_id): JsonResponse
    {
        $post = Post::query()->with(['author', 'attachments'])
            ->where('post_id', $post_id)
            ->firstOrFail();

        return response()->json($post);
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return back()->with([
            'modal_status'  => 'success',
            'modal_action'  => 'delete',
            'modal_title'   => 'Post deleted',
            'modal_message' => 'Post was deleted successfully.',
        ]);
    }


    public function store(PostRequest $request)
    {
        $user = $request->user();

        return DB::transaction(function () use ($request, $user) {
            $post = Post::create([
                'post_uuid' => (string) Str::uuid(),
                'user_id' => $user->user_id,
                'job_title' => $request['job_title'],
                'company' => $request['company'],
                'location' => $request['location'],
                'job_type' => $request['job_type'],
                'salary' => $request['salary'] ?? null,
                'job_description' => $request['job_description'],
                'privacy' => $request['privacy'] ?? 'public',
                'status' => 'pending',
            ]);


            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    if (! $file->isValid()) continue;

                    $path = $file->store('attachments/' . date('Y/m'), 'public');

                    $url = url('storage/' . $path);


                    Attachment::create([
                        'post_id' => $post->post_id,
                        'url' => $url,
                        'type' => $this->guessAttachmentType($file),
                    ]);
                }
            }


            broadcast(new PostsUpdated($post->post_id));

            // Flash a success message (Inertia will expose this in page.props.flash)
            return back()->with([
                'modal_status'  => 'success',
                'modal_action'  => 'create',
                'modal_title'   => 'Job posted',
                'modal_message' => 'Your job post was created successfully.',
            ]);
        });
    }

    protected function guessAttachmentType(UploadedFile $file): string
    {
        $mime = $file->getMimeType() ?? '';
        if (str_starts_with($mime, 'image/')) return 'image';
        if (str_starts_with($mime, 'video/')) return 'video';
        return 'file';
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
            'job_title' => ['sometimes', 'string', 'max:255'],
            'company' => ['sometimes', 'string', 'max:255'],
            'location' => ['sometimes', 'string', 'max:255'],
            'job_type' => ['sometimes', Rule::in(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'])],
            'salary' => ['nullable', 'string', 'max:100'],
            'job_description' => ['sometimes', 'string'],
            'privacy' => ['nullable', Rule::in(['public', 'friends', 'only_me'])],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $post->update($data);

        return response()->json($post);
    }
}
