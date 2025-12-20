<?php

namespace App\Http\Controllers;

use App\Http\Requests\StudentRequest;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $students = Student::query()
            ->when($request->kelas, fn ($q) =>
                $q->where('kelas', $request->kelas)
            )
            ->when($request->rombel, fn ($q) =>
                $q->where('rombel', $request->rombel)
            )
            ->orderBy('nama_lengkap')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/students/index', [
            'students' => $students,
            'filters'  => $request->only(['kelas', 'rombel']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/students/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StudentRequest $request)
    {
        Student::create($request->validated());

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        return Inertia::render('admin/students/edit', [
            'student' => $student,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StudentRequest $request, Student $student)
    {
        $student->update(
            $request->validated() + [
                // pastikan poin tidak diubah lewat form
                'total_poin' => $student->total_poin,
            ]
        );

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        // soft logic (disarankan)
        $student->update(['is_active' => false]);

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa dinonaktifkan.');
    }
}
