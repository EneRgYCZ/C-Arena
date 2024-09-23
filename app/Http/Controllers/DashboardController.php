<?php

namespace App\Http\Controllers;

use App\Models\ProblemSubmission;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'solvedProblemsToday' => ProblemSubmission::where('user_id', Auth::user()->id)
                ->where('score', 100)
                ->whereDate('created_at', Carbon::today())
                ->distinct('problem_id')
                ->count('problem_id'),
            'solvedProblemsTodayComparison' => ProblemSubmission::where('user_id', Auth::user()->id)
                ->where('score', 100)
                ->whereDate('created_at', Carbon::yesterday())
                ->distinct('problem_id')
                ->count('problem_id'),
            'solvedProblemsLast7Days' => ProblemSubmission::where('user_id', Auth::user()->id)
                ->where('score', 100)
                ->whereBetween('created_at', [Carbon::now()->subDays(7), Carbon::now()])
                ->distinct('problem_id')
                ->count('problem_id'),
            'solvedProblemsLast7DaysComparison' => ProblemSubmission::where('user_id', Auth::user()->id)
                ->where('score', 100)
                ->whereBetween('created_at', [Carbon::now()->subDays(14), Carbon::now()->subDays(7)])
                ->distinct('problem_id')
                ->count('problem_id'),
            'solvedProblemsLast14Days' => ProblemSubmission::where('user_id', Auth::user()->id)
                ->where('score', 100)
                ->whereBetween('created_at', [Carbon::now()->subDays(14), Carbon::now()])
                ->distinct('problem_id')
                ->count('problem_id'),
            'solvedProblemsLast14DaysComparison' => ProblemSubmission::where('user_id', Auth::user()->id)
                ->where('score', 100)
                ->whereBetween('created_at', [Carbon::now()->subDays(28), Carbon::now()->subDays(14)])
                ->distinct('problem_id')
                ->count('problem_id'),
            'solvedProblemsLast30Days' => ProblemSubmission::where('user_id', Auth::user()->id)
                ->where('score', 100)
                ->whereBetween('created_at', [Carbon::now()->subDays(30), Carbon::now()])
                ->distinct('problem_id')
                ->count('problem_id'),
            'solvedProblemsLast30DaysComparison' => ProblemSubmission::where('user_id', Auth::user()->id)
                ->where('score', 100)
                ->whereBetween('created_at', [Carbon::now()->subDays(60), Carbon::now()->subDays(30)])
                ->distinct('problem_id')
                ->count('problem_id'),
            'leaderboard' => DB::table('users')
                ->leftJoin('problem_submissions', function ($join) {
                    $join->on('users.id', '=', 'problem_submissions.user_id')
                        ->where('problem_submissions.score', 100);
                })
                ->select('users.id as user_id', 'users.name', DB::raw('count(distinct problem_submissions.problem_id) as total'))
                ->groupBy('users.id', 'users.name')
                ->orderBy('total', 'desc')
                ->take(10)
                ->get()
                ->map(function ($user) {
                    return [
                        'user' => \App\Models\User::find($user->user_id),
                        'total' => $user->total,
                    ];
                }),
        ]);
    }
}
