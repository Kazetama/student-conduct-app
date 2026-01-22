<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PointRule;
use App\Models\Student;
use App\Models\StudentPoint;
use App\Services\FonnteService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentPointController extends Controller
{
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

    public function store(Request $request, FonnteService $fonnte)
    {
        // ===============================
        // LOGIC LAMA (TIDAK DIUBAH)
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

        $point = (int) $rule->point;

        if ($rule->type === 'penalty') {
            $point = -abs($point);
        }

        StudentPoint::create([
            'student_id' => $student->id,
            'point_rule_id' => $rule->id,
            'point' => $point,
            'periode' => $periode,
            'tanggal' => $validated['tanggal'],
            'keterangan' => $validated['keterangan'],
        ]);

        $student->total_poin = max(
            0,
            $student->total_poin + $point
        );

        $student->save();

        // ===============================
        // 🔔 FITUR BARU: NOTIF WA SP 1
        // RULE: total_poin < 75
        // ===============================
        if ($student->total_poin < 75 && !empty($student->no_hp)) {

            $message = "Yth. Orang Tua/Wali dari {$student->nama_lengkap},

Kami informasikan bahwa siswa tersebut telah melakukan pelanggaran tata tertib sekolah.

Total poin pelanggaran saat ini: *{$student->total_poin} poin*.
Siswa dikenakan *Surat Peringatan 1 (SP 1)*.

Mohon perhatian dan kerja sama orang tua untuk pembinaan lebih lanjut.

Terima kasih.
— BK / Manajemen Sekolah";

            $fonnte->send($student->no_hp, $message);
        }

        // ===============================
        // REDIRECT (LOGIC LAMA)
        // ===============================
        return redirect()
            ->route('admin.student-points.create')
            ->with(
                'success',
                "Poin {$point} berhasil diterapkan untuk {$student->nama_lengkap}"
            );
    }
}
