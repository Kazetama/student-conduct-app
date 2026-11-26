<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PointRule;
use App\Models\Student;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'admin_count' => User::role('admin')->count(),
            'bk_count' => User::role('staf_bk')->count(),
            'siswa_user_count' => User::role('siswa')->count(),
            'total_students' => Student::count(),
            'active_students' => Student::where('is_active', true)->count(),
            'inactive_students' => Student::where('is_active', false)->count(),
            'active_rules' => PointRule::where('is_active', true)->count(),
            'total_rules' => PointRule::count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
