<?php

namespace App\Events;

use App\Models\ProblemSubmission;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class EndSubmissionEvent implements ShouldBroadcast
{
    public ProblemSubmission $bestSubmission;

    public ProblemSubmission $lastSubmission;

    public function __construct(ProblemSubmission $bestSubmission, ProblemSubmission $lastSubmission)
    {
        $this->lastSubmission = $lastSubmission;
        $this->bestSubmission = $bestSubmission;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('end-of-submission'),
        ];
    }
}
