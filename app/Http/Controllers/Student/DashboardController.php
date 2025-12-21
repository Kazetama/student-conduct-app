<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $student = Auth::guard('student')->user();

        return Inertia::render('Student/Dashboard', [
            'student' => [
                'nama_lengkap' => $student->nama_lengkap,
                'nisn' => $student->nisn,
                'jenis_kelamin' => $student->jenis_kelamin,
                'tanggal_lahir' => $student->tanggal_lahir->toDateString(),
                'kelas' => $student->kelas,
                'rombel' => $student->rombel,
                'tahun_ajaran' => $student->tahun_ajaran,
                'total_poin' => $student->total_poin,
                'is_active' => $student->is_active,
            ],
        ]);
    }
}
