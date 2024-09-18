<?php

namespace App\Jobs;

use App\Events\EndSubmissionEvent;
use App\Events\TestCaseResultUpdated;
use App\Models\ProblemSubmission;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class EvaluateSubmission implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public ProblemSubmission $submission, public array $testcases, public string $filePath, public User $user) {}

    public function handle(): void
    {
        $file = storage_path('app/'.$this->filePath);

        $outFile = str_replace('.cpp', '', basename($file)).'.out';
        $errFile = str_replace('.cpp', '', basename($file)).'.txt';

        $outFile = storage_path('app/cpp-problem-submission/'.$outFile);
        $errFile = storage_path('app/cpp-problem-submission/'.$errFile);

        $descriptorspec = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['file', $errFile, 'a'],
        ];

        $proc = proc_open("g++ {$file} -o {$outFile}", $descriptorspec, $pipes);
        proc_close($proc);

        $numberOfTestcases = count($this->testcases);
        $pointsPerCase = 100 / $numberOfTestcases;

        $totalScore = 0;
        // Check if the error output file exists
        if (file_exists($errFile) && filesize($errFile) > 0) {
            // Read the contents of the error file
            $errorOutput = file_get_contents($errFile);
            // Update the error_message with the contents of the error file
            $this->submission->error_message = $errorOutput;
            $this->submission->save();

            return;
        } else {
            // Compilation successful, store the resulting binary file
            foreach ($this->testcases as $testcase) {
                // Create a file to store the testcase input
                $inputFile = 'cpp-problem-submission/testcase_input.txt';
                $fileContent = $testcase['input'];
                Storage::put($inputFile, $fileContent);

                // Execute the binary file with the testcase input
                $act = storage_path('app/'.$inputFile);
                $outputOfTestcase = shell_exec("{$outFile} < {$act}");

                if (trim($outputOfTestcase) === trim($testcase['output'])) {
                    // Output matches, update total score
                    $totalScore += $pointsPerCase;

                    // Broadcast updated test case result
                    event(new TestCaseResultUpdated($pointsPerCase, $this->submission->user_id));
                } else {
                    // Output doesn't match, stop and save results
                    $this->submission->score = $totalScore;
                    $this->submission->save();

                    // Get the best submission for the user
                    $bestSubmission = ProblemSubmission::where('problem_id', $this->submission->problem_id)
                        ->where('user_id', $this->user->id)
                        ->orderBy('score', 'desc')
                        ->first();

                    // Broadcast test case failure and end submission
                    event(new TestCaseResultUpdated(0, $this->submission->user_id));
                    event(new EndSubmissionEvent($bestSubmission, $this->submission, $this->submission->user_id));

                    return; // Stop further test case execution
                }
            }

            // All test cases passed, save final score
            $this->submission->score = $totalScore;
            $this->submission->save();

            // Get the best submission for the user
            $bestSubmission = ProblemSubmission::where('problem_id', $this->submission->problem_id)
                ->where('user_id', $this->submission->user_id)
                ->orderBy('score', 'desc')
                ->first();

            // Broadcast end of submission after all test cases
            event(new EndSubmissionEvent($bestSubmission, $this->submission, $this->submission->user_id));
        }
    }
}
