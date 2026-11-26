<?php

namespace App\Http\Controllers\Bk;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $spLevel = (string) $request->input('sp_level', 'all');
        $kelas = (string) $request->input('kelas', '');

        $students = Student::query()
            ->where('is_active', true)
            ->when($search !== '', fn ($q) => $q->where(function ($sub) use ($search) {
                $sub->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%");
            }))
            ->when($kelas !== '', fn ($q) => $q->where('kelas', $kelas))
            ->when(in_array($spLevel, ['0', '1', '2', '3'], true), fn ($q) => $q->where('sp_level', (int) $spLevel))
            ->orderBy('total_poin')
            ->orderBy('nama_lengkap')
            ->paginate(10)
            ->withQueryString();

        $kelasOptions = Student::query()
            ->where('is_active', true)
            ->select('kelas')
            ->distinct()
            ->orderBy('kelas')
            ->pluck('kelas');

        return Inertia::render('bk/students/index', [
            'students' => $students,
            'kelasOptions' => $kelasOptions,
            'filters' => [
                'search' => $search,
                'kelas' => $kelas,
                'sp_level' => $spLevel,
            ],
        ]);
    }
}
