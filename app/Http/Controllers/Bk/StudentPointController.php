<?php

namespace App\Http\Controllers\Bk;

use App\Http\Controllers\Controller;
use App\Models\PointRule;
use App\Models\Student;
use App\Models\StudentPoint;
use App\Services\FonnteService;
use App\Services\StudentPointService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentPointController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));
        $type = $request->input('type', 'all');

        $records = StudentPoint::with([
            'student:id,nama_lengkap,nisn,kelas,rombel,total_poin',
            'pointRule:id,nama,type,kategori',
        ])
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($outer) use ($search) {
                    $outer->whereHas('student', function ($sub) use ($search) {
                        $sub->where('nama_lengkap', 'like', "%{$search}%")
                            ->orWhere('nisn', 'like', "%{$search}%");
                    })->orWhereHas('pointRule', function ($sub) use ($search) {
                        $sub->where('nama', 'like', "%{$search}%");
                    });
                });
            })
            ->when(in_array($type, ['reward', 'penalty'], true), function ($q) use ($type) {
                $q->whereHas('pointRule', fn ($sub) => $sub->where('type', $type));
            })
            ->latest('tanggal')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('bk/student-points/index', [
            'records' => $records,
            'filters' => [
                'search' => $search,
                'type' => $type,
            ],
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('bk/student-points/create', [
            'students' => Student::where('is_active', true)
                ->orderBy('nama_lengkap')
                ->get([
                    'id',
                    'nama_lengkap',
                    'nisn',
                    'kelas',
                    'rombel',
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
            'preselectedStudentId' => $request->input('student_id'),
        ]);
    }

    public function store(
        Request $request,
        FonnteService $fonnte,
        StudentPointService $studentPointService
    ) {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'point_rule_id' => 'required|exists:point_rules,id',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        $student = Student::findOrFail($validated['student_id']);
        $rule = PointRule::findOrFail($validated['point_rule_id']);

        if (! $student->is_active) {
            return back()->with('error', 'Siswa berstatus non-aktif dan tidak dapat diberikan poin.');
        }

        if (! $rule->is_active) {
            return back()->with('error', 'Aturan poin ini sedang non-aktif.');
        }

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

        $pointValue = abs((int) $rule->point);
        $point = $rule->type === 'penalty' ? -$pointValue : $pointValue;

        DB::transaction(function () use ($student, $rule, $point, $periode, $validated) {
            StudentPoint::create([
                'student_id' => $student->id,
                'point_rule_id' => $rule->id,
                'point' => $point,
                'periode' => $periode,
                'tanggal' => $validated['tanggal'],
                'keterangan' => $validated['keterangan'] ?? null,
            ]);

            $student->total_poin = max(0, min(100, $student->total_poin + $point));
            $student->save();
        });

        $student->refresh();
        $studentPointService->syncSpLevelAndNotify($student, $fonnte);

        return redirect()
            ->route('bk.student-points.create')
            ->with(
                'success',
                "Poin {$point} berhasil diterapkan untuk {$student->nama_lengkap}."
            );
    }
}
