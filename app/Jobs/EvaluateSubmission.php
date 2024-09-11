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
        $errFile = str_replace('.cpp', '', basename($file)) . '.txt';

        $outFile = storage_path('app/cpp-problem-submission/' . $outFile);
        $errFile = storage_path('app/cpp-problem-submission/' . $errFile);

        $descriptorspec = array(
            0 => array("pipe", "r"),
            1 => array("pipe", "w"),
            2 => array("file", $errFile, "a")
        );

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
