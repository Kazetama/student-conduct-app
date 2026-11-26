<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $student = $user->student;

        if (! $student) {
            return Inertia::render('Student/Dashboard', [
                'student' => null,
                'pointHistories' => [],
            ]);
        }

        $pointHistories = $student->studentPoints()
            ->with('pointRule:id,nama,type,kategori')
            ->latest('tanggal')
            ->latest('id')
            ->limit(20)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'point' => (int) $item->point,
                'tanggal' => $item->tanggal?->toDateString(),
                'keterangan' => $item->keterangan,
                'point_rule' => $item->pointRule,
            ]);

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
                'sp_level' => $student->sp_level ?? 0,
                'is_active' => $student->is_active,
            ],
            'pointHistories' => $pointHistories,
        ]);
    }
}
