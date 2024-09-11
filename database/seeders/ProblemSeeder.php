<?php

namespace Database\Seeders;

use App\Models\Problem;
use App\Models\Testcase;
use Illuminate\Database\Seeder;

class ProblemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Problem::create([
            'name' => 'CifreBinare',
            'description' => 'Se citesc două numere naturale. Să se afişeze numărul care are mai multe cifre egale cu 1 în reprezentarea în baza 2.',
            'input' => 'Programul citește de la tastatură două numere naturale.',
            'output' => 'Programul afișează pe ecran valoarea cerută.',
            'example_input' => '125 1250',
            'example_output' => '125',
        ]);

        Testcase::create([
            'problem_id' => 1,
            'input' => '125 1250',
            'output' => '125',
        ]);
    }
}
