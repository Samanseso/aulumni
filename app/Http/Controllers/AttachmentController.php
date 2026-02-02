<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AttachmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Attachment::query();
        if ($request->filled('post_id')) {
            $query->where('post_id', $request->input('post_id'));
        }
        $attachments = $query->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($attachments);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'post_id' => ['required', 'integer'],
            'url' => ['required', 'string', 'max:1024'],
            'type' => ['nullable', 'in:image,video,file'],
        ]);

        $post = Post::findOrFail($data['post_id']);

        $attachment = Attachment::create([
            'post_id' => $post->post_id,
            'url' => $data['url'],
            'type' => $data['type'] ?? 'image',
        ]);

        return response()->json($attachment, 201);
    }

    public function destroy(Attachment $attachment): JsonResponse
    {
        $attachment->delete();
        return response()->json(null, 204);
    }
}
