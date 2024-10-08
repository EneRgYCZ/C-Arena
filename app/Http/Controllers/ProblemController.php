<?php

namespace App\Http\Controllers;

use App\Enum\ToastType;
use App\Jobs\EvaluateSubmission;
use App\Models\Problem;
use App\Models\ProblemSubmission;
use App\Models\Testcase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Modules\Datatable\Column;
use Modules\Datatable\SearchInput;
use Modules\Datatable\Table;
use Spatie\QueryBuilder\QueryBuilder;

class ProblemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $problems = QueryBuilder::for(Problem::query())
            ->allowedSorts('id', 'name')
            ->allowedFilters(
                'name',
                'description',
            )
            ->paginate(request('perPage') ?? Table::DEFAULT_PER_PAGE)
            ->withQueryString();

        return inertia()->render('problems/index', [
            'problems' => $problems,
        ])->table(function (Table $table) {
            $table
                ->addColumn(new Column('id', 'Id', sortable: true))
                ->addColumn(new Column('name', 'Name', sortable: true))
                ->addColumn(new Column('description', 'Description'))
                ->addSearchInput(new SearchInput('name', 'Name', shown: true))
                ->addSearchInput(new SearchInput('description', 'Description'));
        });
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Problem $problem)
    {
        return inertia()->render('problems/show', [
            'problem' => $problem,
            'lastSubmission' => ProblemSubmission::where('problem_id', $problem->id)
                ->where('user_id', Auth::user()->id)
                ->orderBy('created_at', 'desc')
                ->first(),
            'bestSubmission' => ProblemSubmission::where('problem_id', $problem->id)
                ->where('user_id', Auth::user()->id)
                ->orderBy('score', 'desc')
                ->first(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Problem $problem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Problem $problem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Problem $problem)
    {
        //
    }

    public function submitSolution(Request $request, Problem $problem)
    {
        $validated = $request->validate([
            'file' => [
                'nullable',
            ],
            'code' => [
                'nullable',
                'string',
            ],
        ]);

        if ($validated['code']) {
            $uuid = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $filePath = 'cpp-problem-submission/'.$uuid.'.cpp';
            Storage::put($filePath, $validated['code']);
        } else {
            $uuid = \Ramsey\Uuid\Uuid::uuid4()->toString();
            $filePath = $validated['file']->storeAs('cpp-problem-submission', $uuid.'.'.$validated['file']->getClientOriginalExtension());
        }

        $testCases = Testcase::where('problem_id', $problem->id)->get()->toArray();

        if (! $filePath) {
            $this->toast('There was an error during the upload of the file', ToastType::Danger);

            return redirect()->back();
        }

        $submission = ProblemSubmission::create([
            'problem_id' => $problem->id,
            'user_id' => Auth::user()->id,
            'score' => 0,
        ]);

        dispatch(new EvaluateSubmission($submission, $testCases, $filePath, Auth::user()));

        $this->toast('The solution was sent and the solution is tested', ToastType::Success);

        return redirect()->back();
    }
}
