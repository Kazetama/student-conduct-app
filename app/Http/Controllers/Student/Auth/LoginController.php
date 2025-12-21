<?php

namespace App\Http\Controllers\Student\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Halaman login student
     */
    public function showLoginForm()
    {
        // Jika sudah login, langsung ke dashboard
        if (Auth::guard('student')->check()) {
            return redirect('/student/dashboard');
        }

        return Inertia::render('Student/Auth/Login');
    }

    /**
     * Proses login student (TANPA password)
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'nisn' => ['required', 'string'],
            'tanggal_lahir' => ['required', 'date'],
        ]);

        $student = Student::query()
            ->where('nisn', $validated['nisn'])
            ->where('tanggal_lahir', $validated['tanggal_lahir'])
            ->where('is_active', true)
            ->first();

        if (! $student) {
            return back()->withErrors([
                'nisn' => 'NISN atau Tanggal Lahir tidak valid.',
            ]);
        }

        // Login manual (INI YANG BENAR)
        Auth::guard('student')->login($student);

        // Amankan session
        $request->session()->regenerate();

        return redirect('/student/dashboard');
    }

    /**
     * Logout student (AMAN & BERSIH)
     */
    public function logout(Request $request)
    {
        Auth::guard('student')->logout();

        // Hard reset session untuk keamanan
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/student/login');
    }
}
