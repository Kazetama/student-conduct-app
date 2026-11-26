<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentRequest;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status', 'active');
        $search = trim((string) $request->input('search', ''));

        $students = Student::query()
            ->when($status === 'active', fn ($q) => $q->where('is_active', true))
            ->when($status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->when($search !== '', fn ($q) => $q->where(function ($sub) use ($search) {
                $sub->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%");
            }))
            ->when($request->filled('kelas'), fn ($q) => $q->where('kelas', $request->kelas))
            ->when($request->filled('rombel'), fn ($q) => $q->where('rombel', $request->rombel))
            ->orderBy('nama_lengkap')
            ->paginate(10)
            ->withQueryString();

        $activeStudents = Student::where('is_active', true);

        $stats = [
            'total' => (clone $activeStudents)->count(),
            'safe' => (clone $activeStudents)->where('total_poin', '>=', 90)->count(),
            'warning' => (clone $activeStudents)->whereBetween('total_poin', [50, 89])->count(),
            'critical' => (clone $activeStudents)->where('total_poin', '<', 50)->count(),
        ];

        $kelasOptions = Student::query()
            ->select('kelas')
            ->distinct()
            ->orderBy('kelas')
            ->pluck('kelas');

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'stats' => $stats,
            'kelasOptions' => $kelasOptions,
            'filters' => [
                'search' => $search,
                'kelas' => $request->input('kelas', ''),
                'status' => $status,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/students/create');
    }

    public function store(StudentRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            Role::firstOrCreate(['name' => 'siswa', 'guard_name' => 'web']);

            $defaultEmail = $validated['nisn'].'@siswa.sch.id';
            $defaultPassword = Carbon::parse($validated['tanggal_lahir'])->format('Y-m-d');

            $user = User::firstOrCreate(
                ['email' => $defaultEmail],
                [
                    'name' => $validated['nama_lengkap'],
                    'password' => $defaultPassword,
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole('siswa');

            Student::create($validated + [
                'user_id' => $user->id,
            ]);
        });

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa & akun login (NISN / tanggal lahir YYYY-MM-DD) berhasil dibuat.');
    }

    public function edit(Student $student)
    {
        return Inertia::render('admin/students/edit', [
            'student' => $student,
        ]);
    }

    public function update(StudentRequest $request, Student $student)
    {
        $student->update(
            $request->validated() + [
                'total_poin' => $student->total_poin,
            ]
        );

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    public function destroy(Student $student)
    {
        $student->update(['is_active' => false]);

        return redirect()
            ->route('students.index')
            ->with('success', "Siswa {$student->nama_lengkap} berhasil dinonaktifkan.");
    }

    public function toggleStatus(Student $student)
    {
        $nextStatus = ! $student->is_active;
        $student->update(['is_active' => $nextStatus]);

        $message = $nextStatus
            ? "Siswa {$student->nama_lengkap} berhasil diaktifkan kembali."
            : "Siswa {$student->nama_lengkap} berhasil dinonaktifkan.";

        return back()->with('success', $message);
    }

    public function export(): StreamedResponse
    {
        $students = Student::orderBy('kelas')
            ->orderBy('rombel')
            ->orderBy('nama_lengkap')
            ->get();

        $filename = 'data-siswa-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($students) {
            $handle = fopen('php://output', 'w');
            // UTF-8 BOM agar Excel membaca karakter dengan benar
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'NISN',
                'Nama Lengkap',
                'Jenis Kelamin',
                'Tanggal Lahir',
                'Kelas',
                'Rombel',
                'Tahun Ajaran',
                'No HP',
                'Total Poin',
                'SP Level',
                'Status',
            ]);

            foreach ($students as $student) {
                fputcsv($handle, [
                    $student->nisn,
                    $student->nama_lengkap,
                    $student->jenis_kelamin,
                    $student->tanggal_lahir?->toDateString(),
                    $student->kelas,
                    $student->rombel,
                    $student->tahun_ajaran,
                    $student->no_hp ?? '-',
                    $student->total_poin,
                    $student->sp_level ?? 0,
                    $student->is_active ? 'Aktif' : 'Nonaktif',
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
