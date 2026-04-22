<?php

namespace App\Jobs;

use App\Actions\Alumni\CreateAlumni;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ImportAlumniRow implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 5; 

    public function __construct(private readonly array $payload) {}

    public function handle(CreateAlumni $action): void
    {
        $action->create($this->payload);
    }
}