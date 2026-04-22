<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class ImportReportNotification extends Notification 
{

    /**
     * @var array
     * Expected shape:
     * [
     *   'total' => int|null,
     *   'succeeded' => int|null,
     *   'failed' => int,
     *   'failures' => [
     *       ['row' => int, 'attribute' => string, 'errors' => array, 'values' => array],
     *       ...
     *   ],
     *   'report_url' => string|null // optional link to downloadable CSV/JSON of failures
     * ]
     */
    protected array $report;

    public function __construct(array $report)
    {
        $this->report = $report;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    /**
     * Stored in the database notifications table data column
     */
    public function toArray($notifiable): array
    {
        return $this->payload();
    }

    /**
     * Broadcast payload for real time clients
     */
    public function toBroadcast($notifiable): BroadcastMessage
    {
        return (new BroadcastMessage($this->payload()))
            ->onConnection('sync');
    }

    /**
     * Centralized payload builder
     */
    protected function payload(): array
    {
        $total = $this->report['total'] ?? null;
        $succeeded = $this->report['succeeded'] ?? null;
        $failed = $this->report['failed'] ?? 0;
        $failures = $this->report['failures'] ?? [];
        $reportUrl = $this->report['report_url'] ?? null;

        $message = $failed > 0
            ? "{$succeeded} of {$total} rows succeeded. {$failed} failed."
            : "Import finished. All {$total} rows were imported successfully.";

        return [
            'title' => 'Import completed',
            'message' => $message,
            'report' => [
                'total' => $total,
                'succeeded' => $succeeded,
                'failed' => $failed,
                'failures' => $failures,
                'report_url' => $reportUrl,
            ],
            'timestamp' => now()->toDateTimeString(),
        ];
    }
}
