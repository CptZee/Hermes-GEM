<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class NewPostNotification extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return [WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('New Post Created!')
            ->icon('/icon.png')
            ->body('A new Posting Idea has been added!')
            ->action('View Post', '/posts')
            ->data(['url' => '/posts']);
    }
}
