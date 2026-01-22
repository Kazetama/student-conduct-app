<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PointRule;
use App\Models\Student;
use App\Models\StudentPoint;
use App\Services\FonnteService;
use App\Services\StudentPointService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentPointController extends Controller
{
    /**
     * Form input poin siswa
     */
    public function create()
    {
        return Inertia::render('admin/student-points/create', [
            'students' => Student::where('is_active', true)
                ->orderBy('nama_lengkap')
                ->get([
                    'id',
                    'nama_lengkap',
                    'nisn',
                    'total_poin',
                ]),
            'rules' => PointRule::where('is_active', true)
                ->orderBy('type')
                ->orderBy('kategori')
                ->get([
                    'id',
                    'nama',
                    'type',
                    'kategori',
                    'point',
                    'max_per_period',
                ]),
        ]);
    }

    /**
     * Simpan poin siswa
     */
    public function store(
        Request $request,
        FonnteService $fonnte,
        StudentPointService $studentPointService
    ) {
        // ===============================
        // VALIDASI (LOGIC LAMA)
        // ===============================
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'point_rule_id' => 'required|exists:point_rules,id',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        $student = Student::findOrFail($validated['student_id']);
        $rule = PointRule::findOrFail($validated['point_rule_id']);

        $periode = Carbon::parse($validated['tanggal'])->format('Y-m');

        // ===============================
        // VALIDASI MAX PER PERIODE
        // ===============================
        if ($rule->max_per_period !== null) {
            $usedCount = StudentPoint::where('student_id', $student->id)
                ->where('point_rule_id', $rule->id)
                ->where('periode', $periode)
                ->count();

            if ($usedCount >= $rule->max_per_period) {
                return back()->with(
                    'error',
                    'Batas pemberian poin untuk aturan ini pada periode tersebut telah tercapai.'
                );
            }
        }

        // ===============================
        // HITUNG POINT (LOGIC LAMA)
        // ===============================
        $point = (int) $rule->point;

        if ($rule->type === 'penalty') {
            $point = -abs($point);
        }

        // ===============================
        // SIMPAN DETAIL POIN
        // ===============================
        StudentPoint::create([
            'student_id' => $student->id,
            'point_rule_id' => $rule->id,
            'point' => $point,
            'periode' => $periode,
            'tanggal' => $validated['tanggal'],
            'keterangan' => $validated['keterangan'],
        ]);

        // ===============================
        // UPDATE TOTAL POIN SISWA
        // ===============================
        $student->total_poin = max(
            0,
            $student->total_poin + $point
        );
        $student->save();

        // ===============================
        // 🔔 NOTIF WA (DIPINDAH KE SERVICE)
        // ===============================
        $studentPointService->handleSp1Notification(
            $student,
            $fonnte
        );

        // ===============================
        // REDIRECT
        // ===============================
        return redirect()
            ->route('admin.student-points.create')
            ->with(
                'success',
                "Poin {$point} berhasil diterapkan untuk {$student->nama_lengkap}"
            );
    }
}
