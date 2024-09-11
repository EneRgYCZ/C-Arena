<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testcase extends Model
{
    public function problem(): BelongsTo
    {
        return $this->belongsTo(Problem::class);
    }
}
