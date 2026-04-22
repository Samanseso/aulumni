<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountActivatedNotification extends Notification
{
    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your account has been activated')
            ->markdown('mail.account-activated', [
                'name' => $notifiable->name,
                'loginUrl' => url('/login'),
            ]);
    }
}
