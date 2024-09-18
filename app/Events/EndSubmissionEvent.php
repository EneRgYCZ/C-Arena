<?php

namespace App\Events;

use App\Models\ProblemSubmission;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class EndSubmissionEvent implements ShouldBroadcast
{
    public ProblemSubmission $bestSubmission;

    public ProblemSubmission $lastSubmission;

    public int $userId;

    public function __construct(ProblemSubmission $bestSubmission, ProblemSubmission $lastSubmission, int $userId)
    {
        $this->lastSubmission = $lastSubmission;
        $this->bestSubmission = $bestSubmission;
        $this->userId = $userId;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('end-of-submission.'.$this->userId),
        ];
    }
}
