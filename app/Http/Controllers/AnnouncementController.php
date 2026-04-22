<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use App\Http\Requests\AnnouncementRequest;
use App\Models\Announcement;
use App\Models\AnnouncementAttachment;
use App\Models\SystemLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AnnouncementController extends Controller
{
    use PasswordValidationRules;

    public function index(Request $request)
    {
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'approved', 'rejected'])],
            'event_type' => ['nullable', Rule::in(['Seminar', 'Workshop', 'Webinar', 'Career Fair', 'Alumni Gathering', 'General Event'])],
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $query = Announcement::query()->with(['author', 'attachments']);

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (! empty($validated['event_type'])) {
            $query->where('event_type', $validated['event_type']);
        }

        if (! empty($validated['search'])) {
            $search = trim($validated['search']);
            $query->where(function ($inner) use ($search) {
                $inner->where('title', 'like', "%{$search}%")
                    ->orWhere('organizer', 'like', "%{$search}%")
                    ->orWhere('venue', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return Inertia::render('admin/announcements', [
            'announcements' => $query
                ->orderByDesc('starts_at')
                ->get(),
        ]);
    }

    public function show(Announcement $announcement): JsonResponse
    {
        $announcement = Announcement::query()
            ->with(['author', 'attachments'])
            ->where('announcement_id', $announcement->announcement_id)
            ->firstOrFail();

        return response()->json($announcement);
    }

    public function store(AnnouncementRequest $request): RedirectResponse
    {
        $user = $request->user();

        DB::transaction(function () use ($request, $user) {
            $announcement = Announcement::create([
                'announcement_uuid' => (string) Str::uuid(),
                'user_id' => $user->user_id,
                'title' => $request['title'],
                'event_type' => $request['event_type'],
                'organizer' => $request['organizer'] ?: $user->name,
                'venue' => $request['venue'],
                'starts_at' => $request['starts_at'],
                'ends_at' => $request['ends_at'],
                'description' => $request['description'],
                'privacy' => $request['privacy'] ?? 'public',
                'status' => 'pending',
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    if (! $file->isValid()) {
                        continue;
                    }

                    $path = $file->store('announcement-attachments/' . date('Y/m'), 'public');

                    AnnouncementAttachment::create([
                        'announcement_id' => $announcement->announcement_id,
                        'url' => url('storage/' . $path),
                        'type' => $this->guessAttachmentType($file),
                    ]);
                }
            }
        });

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'create',
            'modal_title' => 'Announcement created',
            'modal_message' => 'Event announcement was saved and is pending approval.',
        ]);
    }

    public function update(Request $request, Announcement $announcement): RedirectResponse
    {
        $user = $request->user();
        $validated = $this->validateAnnouncement($request);

        if ($user) {
            $announcement->update($this->payloadForPersistence($validated, $user->user_id, $announcement));
            SystemLog::query()->create([
                'user_id'    => $user->user_id,
                'user_name'  => $user->user_name,
                'user_type'  => $user->user_type,
                'action'     => 'Update',
                'resource'   => 'Announcements',
                'route_name' => $request->route()?->getName(),
                'method'     => $request->method(),
                'url'        => $request->fullUrl(),
                'ip_address' => $request->ip(),
                'summary'    => 'Updated event announcement "' . $announcement->title . '".',
                'metadata'   => [
                    'announcement_id' => $announcement->announcement_id,
                    'title'           => $announcement->title,
                ],
            ]);
        }


        return back()->with([
            'modal_status'  => 'success',
            'modal_action'  => 'update',
            'modal_title'   => 'Announcement updated!',
            'modal_message' => 'Event announcement "' . $announcement->title . '" was updated successfully.',
        ]);
    }



    public function destroy(Announcement $announcement): RedirectResponse
    {
        $announcement->delete();

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'delete',
            'modal_title' => 'Announcement deleted',
            'modal_message' => 'Announcement was deleted successfully.',
        ]);
    }

    public function approve(Announcement $announcement): RedirectResponse
    {
        $announcement->status = 'approved';
        $announcement->save();

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Announcement approved',
            'modal_message' => 'Announcement is now visible to alumni.',
        ]);
    }

    public function reject(Announcement $announcement): RedirectResponse
    {
        $announcement->status = 'rejected';
        $announcement->save();

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Announcement rejected',
            'modal_message' => 'Announcement was marked as rejected.',
        ]);
    }

    public function bulk_approve(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'announcement_ids' => ['required', 'array', 'min:1'],
            'announcement_ids.*' => ['integer', 'exists:announcements,announcement_id'],
        ]);

        Announcement::query()
            ->whereIn('announcement_id', $validated['announcement_ids'])
            ->update(['status' => 'approved']);

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Announcement approved',
            'modal_message' => 'Selected announcements are now visible to alumni.',
            'signal_deselect' => (string) Str::uuid(),
        ]);
    }

    public function bulk_reject(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'announcement_ids' => ['required', 'array', 'min:1'],
            'announcement_ids.*' => ['integer', 'exists:announcements,announcement_id'],
        ]);

        Announcement::query()
            ->whereIn('announcement_id', $validated['announcement_ids'])
            ->update(['status' => 'rejected']);

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'update',
            'modal_title' => 'Announcement rejected',
            'modal_message' => 'Selected announcements were marked as rejected.',
            'signal_deselect' => (string) Str::uuid(),
        ]);
    }

    public function bulk_delete(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'password' => $this->currentPasswordRules(),
            'announcement_ids' => ['required', 'array', 'min:1'],
            'announcement_ids.*' => ['integer', 'exists:announcements,announcement_id'],
        ]);

        Announcement::destroy($validated['announcement_ids']);

        return back()->with([
            'modal_status' => 'success',
            'modal_action' => 'delete',
            'modal_title' => 'Deletion successful!',
            'modal_message' => 'Selected announcements were deleted successfully.',
            'signal_deselect' => (string) Str::uuid(),
        ]);
    }

    protected function guessAttachmentType(UploadedFile $file): string
    {
        $mime = $file->getMimeType() ?? '';

        if (str_starts_with($mime, 'image/')) {
            return 'image';
        }

        if (str_starts_with($mime, 'video/')) {
            return 'video';
        }

        return 'file';
    }


    private function validateAnnouncement(Request $request): array
    {
        return $request->validate([
            'title'             => ['required', 'string', 'max:255'],
            'event_type'        => ['required', 'string', 'in:Seminar,Workshop,Webinar,Career Fair,Alumni Gathering,General Event'],
            'organizer'         => ['required', 'string', 'max:255'],
            'venue'             => ['required', 'string', 'max:255'],
            'starts_at'         => ['required', 'date'],
            'ends_at'           => ['required', 'date', 'after:starts_at'],
            'description'       => ['required', 'string'],
            'attachments'       => ['nullable', 'array'],
            'attachments.*'     => ['file', 'mimes:jpg,jpeg,png,gif,webp,mp4,mov,pdf,doc,docx', 'max:51200'],
        ]);
    }

    private function payloadForPersistence(array $validated, int $userId, ?Announcement $existing = null): array
    {
        $payload = [
            'title'             => $validated['title'],
            'event_type'        => $validated['event_type'],
            'organizer'         => $validated['organizer'],
            'venue'             => $validated['venue'],
            'starts_at'         => $validated['starts_at'],
            'ends_at'           => $validated['ends_at'],
            'description'       => $validated['description'],
            'updated_by'        => $userId,
        ];

        // Only set created_by on new records
        if ($existing === null) {
            $payload['created_by'] = $userId;
            $payload['status'] = 'pending';
        }

        // Handle attachments if any were uploaded
        if (!empty($validated['attachments'])) {
            $paths = [];
            foreach ($validated['attachments'] as $file) {
                $paths[] = $file->store('announcements/attachments', 'public');
            }
            // Merge with existing attachments on update, replace on create
            $payload['attachments'] = $existing
                ? array_merge($existing->attachments ?? [], $paths)
                : $paths;
        }

        return $payload;
    }
}
