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
        return new BroadcastMessage($this->payload());
    }

    protected function payload(): array
    {
        return [
            'title' => $this->alumni->name . ' submitted an employment survey',
            'message' => 'Review the updated employment record from @' . $this->alumni->user_name . '.',
            'alumni_name' => $this->alumni->name,
            'alumni_user_name' => $this->alumni->user_name,
            'current_employed' => $this->alumni->employment_details?->current_employed,
            'current_work_company' => $this->alumni->employment_details?->current_work_company,
            'timestamp' => now()->toDateTimeString(),
            'action_url' => '/user/alumni/' . $this->alumni->user_name . '/employment',
        ];
    }
}
