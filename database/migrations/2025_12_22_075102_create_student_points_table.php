<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();
            $table->foreignId('point_rule_id')
                ->constrained('point_rules')
                ->cascadeOnDelete();
            $table->integer('point');
            $table->string('periode', 20);
            $table->text('keterangan')->nullable();
            $table->date('tanggal');
            $table->timestamps();
            $table->index(['student_id', 'point_rule_id', 'periode']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_points');
    }
};
