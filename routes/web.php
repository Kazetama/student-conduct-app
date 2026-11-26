<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\PointRuleController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Bk\DashboardController as BkDashboardController;
use App\Http\Controllers\Bk\StudentController as BkStudentController;
use App\Http\Controllers\Bk\StudentPointController as BkStudentPointController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\StudentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function (Request $request) {
    if ($user = $request->user()) {
        if ($user->hasRole('admin')) {
            return redirect('/dashboard');
        }

        if ($user->hasRole('staf_bk')) {
            return redirect('/bk/dashboard');
        }

        return redirect('/student/dashboard');
    }

    return Inertia::render('auth/login', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'canRegister' => Features::enabled(Features::registration()),
        'status' => $request->session()->get('status'),
    ]);
})->name('home');

// Portal Siswa (Role: siswa)
Route::middleware(['auth', 'verified', 'role:siswa'])->group(function () {
    Route::get('student/dashboard', [StudentDashboardController::class, 'index'])
        ->name('student.dashboard');
});

// Panel Staf BK (Role: staf_bk)
Route::middleware(['auth', 'verified', 'role:staf_bk'])->prefix('bk')->name('bk.')->group(function () {
    Route::get('dashboard', [BkDashboardController::class, 'index'])
        ->name('dashboard');
    Route::get('students', [BkStudentController::class, 'index'])
        ->name('students.index');
    Route::get('student-points', [BkStudentPointController::class, 'index'])
        ->name('student-points.index');
    Route::get('student-points/create', [BkStudentPointController::class, 'create'])
        ->name('student-points.create');
    Route::post('student-points', [BkStudentPointController::class, 'store'])
        ->name('student-points.store');
});

// Panel Administrator (Role: admin)
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('admin/students/export', [StudentController::class, 'export'])
        ->name('students.export');
    Route::patch('admin/students/{student}/toggle-status', [StudentController::class, 'toggleStatus'])
        ->name('students.toggle-status');
    Route::resource('admin/students', StudentController::class)
        ->except(['show']);

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('point-rules', PointRuleController::class)
            ->except(['show']);
        Route::resource('users', UserManagementController::class)
            ->except(['show', 'create', 'edit']);
    });
});

require __DIR__.'/settings.php';
