<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentPoint;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_students' => Student::count(),
            'active_students' => Student::where('is_active', true)->count(),
            'inactive_students' => Student::where('is_active', false)->count(),
        ];

        $pointsChart = StudentPoint::select(
                DB::raw('DATE(tanggal) as date'),
                DB::raw('SUM(ABS(point)) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'total' => (int) $row->total,
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'pointsChart' => $pointsChart,
        ]);
    }
}
