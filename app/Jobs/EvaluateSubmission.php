<?php

namespace App\Jobs;

use App\Models\ProblemSubmission;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class EvaluateSubmission implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public ProblemSubmission $submission, public array $testcases, public string $filePath) {}

    public function handle(): void
    {

        $file = storage_path('app/' . $this->filePath);

        $outFile = str_replace('.cpp', '', basename($file)) . '.out';

        $outFile = storage_path('app/cpp-problem-submission/' . $outFile);

        $output = shell_exec("g++ {$file} -o {$outFile}");

        $numberOfTestcases = count($this->testcases);
        $pointsPerCase = 100 / $numberOfTestcases;

        $totalScore = 0;

        if (strpos($output, 'error') !== false) {
            // If there's a compilation error, store an error message in the submission record
            $this->submission->error_message = $output;
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
                $act = storage_path('app/' . $inputFile);
                $outputOfTestcase = shell_exec("{$outFile} < {$act}");

                if (trim($outputOfTestcase) === trim($testcase['output'])) {
                    // Output matches, do something
                    $totalScore += $pointsPerCase;
                } else {
                    // Output doesn't match, do something else
                    $this->submission->score = $totalScore;
                    $this->submission->save();
                    return;
                }
            }
            $this->submission->score = $totalScore;
            $this->submission->save();
            return;
        }

        return;
    }
}
