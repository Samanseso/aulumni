<?php

namespace App\Notifications;

use App\Models\Alumni;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class EmploymentSurveySubmittedNotification extends Notification
{
    public function __construct(
        protected Alumni $alumni,
    ) {
        $this->alumni->loadMissing([
            'user',
            'academic_details',
        ]);
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return $this->payload();
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return (new BroadcastMessage($this->payload()))
            ->onConnection('sync');
    }

    protected function payload(): array
    {
        $displayName = $this->alumni->user?->name ?: 'New alumni account';
        $userName = $this->alumni->user?->user_name;

        return [
            'alumni_id' => $this->alumni->alumni_id,
            'title' => $displayName . ' created an alumni account',
            'message' => filled($userName)
                ? 'Review and activate the pending account for @' . $userName . '.'
                : 'Review and activate the new pending alumni account.',
            'alumni_name' => $displayName,
            'alumni_user_name' => $userName,
            'email' => $this->alumni->user?->email,
            'account_status' => $this->alumni->user?->status,
            'school_level' => $this->alumni->academic_details?->school_level,
            'timestamp' => now()->toDateTimeString(),
            'action_url' => filled($userName)
                ? '/user/alumni/' . $userName
                : '/user/alumni',
        ];
    }
}
