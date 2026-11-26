<?php

namespace App\Http\Controllers\Bk;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentPoint;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $activeQuery = Student::where('is_active', true);

        $stats = [
            'active_students' => (clone $activeQuery)->count(),
            'safe_students' => (clone $activeQuery)->where('total_poin', '>=', 90)->count(),
            'warning_students' => (clone $activeQuery)->whereBetween('total_poin', [50, 89])->count(),
            'critical_students' => (clone $activeQuery)->where('total_poin', '<', 50)->count(),
            'average_points' => round((float) ((clone $activeQuery)->avg('total_poin') ?? 0), 1),
        ];

        $startDate = Carbon::now()->subDays(29)->toDateString();

        $pointsChart = StudentPoint::select(
            DB::raw('DATE(tanggal) as date'),
            DB::raw('SUM(CASE WHEN point < 0 THEN ABS(point) ELSE 0 END) as violations'),
            DB::raw('SUM(CASE WHEN point > 0 THEN point ELSE 0 END) as rewards'),
            DB::raw('COUNT(*) as total_events')
        )
            ->whereDate('tanggal', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'violations' => (int) $row->violations,
                'rewards' => (int) $row->rewards,
                'total_events' => (int) $row->total_events,
            ]);

        $recentActivities = StudentPoint::with([
            'student:id,nama_lengkap,nisn,kelas,rombel,total_poin',
            'pointRule:id,nama,type,kategori',
        ])
            ->latest('tanggal')
            ->latest('id')
            ->limit(6)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'point' => (int) $item->point,
                'tanggal' => $item->tanggal?->toDateString(),
                'keterangan' => $item->keterangan,
                'student' => $item->student,
                'point_rule' => $item->pointRule,
            ]);

        return Inertia::render('bk/dashboard', [
            'stats' => $stats,
            'pointsChart' => $pointsChart,
            'recentActivities' => $recentActivities,
        ]);
    }
}
