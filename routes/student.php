<?php

use App\Http\Controllers\Student\Auth\LoginController;
use App\Http\Controllers\Student\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('student')->group(function () {

    Route::middleware('guest:student')->group(function () {
        Route::get('/login', [LoginController::class, 'showLoginForm']);
        Route::post('/login/submit', [LoginController::class, 'login']);
    });

    Route::middleware('auth:student')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::post('/logout', [LoginController::class, 'logout']);
    });
});
