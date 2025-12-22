<?php

use App\Http\Controllers\Admin\PointRuleController;
use App\Http\Controllers\Admin\StudentPointController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('admin/students', StudentController::class);
});

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('point-rules', PointRuleController::class);

    Route::get(
        'student-points/create',
        [StudentPointController::class, 'create']
    )->name('student-points.create');

    Route::post(
        'student-points',
        [StudentPointController::class, 'store']
    )->name('student-points.store');

});

require __DIR__.'/settings.php';
require __DIR__.'/student.php';
