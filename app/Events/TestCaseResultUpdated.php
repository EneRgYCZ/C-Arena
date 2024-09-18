<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class TestCaseResultUpdated implements ShouldBroadcast
{
    public int|float $pointsPerCase;

    public int $userId;

    public function __construct(int|float $pointsPerCase, int $userId)
    {
        $this->pointsPerCase = $pointsPerCase;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('test-case-results.'.$this->userId);
    }
}
