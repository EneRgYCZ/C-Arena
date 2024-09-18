<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Problem extends Model
{
    public function testCases(): HasMany
    {
        return $this->hasMany(Testcase::class);
    }

    public function problemSubmissins(): HasMany
    {
        return $this->hasMany(ProblemSubmission::class);
    }
}
