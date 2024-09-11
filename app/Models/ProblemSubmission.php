<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProblemSubmission extends Model
{
    protected $fillable = [
        'problem_id',
        'user_id',
        'score',
    ];
}
