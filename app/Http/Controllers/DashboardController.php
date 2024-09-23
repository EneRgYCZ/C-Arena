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
        $userId = Auth::user()->id;

        $solvedProblems = function ($start, $end) use ($userId) {
            return ProblemSubmission::where('user_id', $userId)
                ->where('score', 100)
                ->whereBetween('created_at', [$start, $end])
                ->distinct('problem_id')
                ->count('problem_id');
        };

        return Inertia::render('Dashboard', [
            'solvedProblemsToday' => $solvedProblems(Carbon::today(), Carbon::now()),
            'solvedProblemsTodayComparison' => $solvedProblems(Carbon::yesterday(), Carbon::yesterday()->endOfDay()),
            'solvedProblemsLast7Days' => $solvedProblems(Carbon::now()->subDays(7), Carbon::now()),
            'solvedProblemsLast7DaysComparison' => $solvedProblems(Carbon::now()->subDays(14), Carbon::now()->subDays(7)),
            'solvedProblemsLast14Days' => $solvedProblems(Carbon::now()->subDays(14), Carbon::now()),
            'solvedProblemsLast14DaysComparison' => $solvedProblems(Carbon::now()->subDays(28), Carbon::now()->subDays(14)),
            'solvedProblemsLast30Days' => $solvedProblems(Carbon::now()->subDays(30), Carbon::now()),
            'solvedProblemsLast30DaysComparison' => $solvedProblems(Carbon::now()->subDays(60), Carbon::now()->subDays(30)),
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
