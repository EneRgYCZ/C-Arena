<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class TestCaseResultUpdated implements ShouldBroadcast
{
    public int|float $pointsPerCase;

    public function __construct($pointsPerCase)
    {
        $this->pointsPerCase = $pointsPerCase;
    }

    public function broadcastOn()
    {
        return new Channel('test-case-results');
    }
}
