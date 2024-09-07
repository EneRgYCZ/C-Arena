<?php

use App\Models\Problem;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('testcases', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Problem::class);
            $table->string('input');
            $table->string('output');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testcases');
    }
};
