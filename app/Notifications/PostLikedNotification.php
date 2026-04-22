<?php

namespace App\Notifications;

use App\Models\Post;
use App\Models\User;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class PostLikedNotification extends Notification
{
    public function __construct(
        protected User $actor,
        protected Post $post,
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
        return (new BroadcastMessage($this->payload()))
            ->onConnection('sync');
    }

    protected function payload(): array
    {
        return [
            'title' => $this->actor->name . ' liked your post',
            'message' => $this->actor->name . ' reacted to "' . $this->post->job_title . '".',
            'actor_name' => $this->actor->name,
            'actor_user_name' => $this->actor->user_name,
            'post_id' => $this->post->post_id,
            'job_title' => $this->post->job_title,
            'timestamp' => now()->toDateTimeString(),
            'action_url' => '/',
        ];
    }
}
