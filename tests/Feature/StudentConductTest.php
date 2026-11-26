<?php

namespace Tests\Feature;

use App\Models\PointRule;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class StudentConductTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (['admin', 'staf_bk', 'siswa'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }
    }

    private function createUserWithRole(string $role, array $overrides = []): User
    {
        $user = User::factory()->withoutTwoFactor()->create($overrides);
        $user->assignRole($role);

        return $user;
    }

    private function createStudent(array $overrides = []): Student
    {
        $siswaUser = $this->createUserWithRole('siswa', [
            'name' => $overrides['nama_lengkap'] ?? 'Budi Santoso',
            'email' => ($overrides['nisn'] ?? '0081234567') . '@siswa.sch.id',
            'password' => '2009-05-10',
        ]);

        return Student::create(array_merge([
            'user_id' => $siswaUser->id,
            'nama_lengkap' => 'Budi Santoso',
            'nisn' => '0081234567',
            'jenis_kelamin' => 'L',
            'tanggal_lahir' => '2009-05-10',
            'kelas' => 'VIII',
            'rombel' => 'A',
            'tahun_ajaran' => '2025/2026',
            'no_hp' => '6281234567890',
            'total_poin' => 100,
            'sp_level' => 0,
            'is_active' => true,
        ], $overrides));
    }

    public function test_admin_can_access_admin_panel_and_is_separated_from_bk_panel(): void
    {
        $admin = $this->createUserWithRole('admin');
        $this->actingAs($admin);

        $student = $this->createStudent();

        $this->get('/dashboard')->assertOk();
        $this->get('/admin/students')->assertOk();
        $this->get('/admin/users')->assertOk();
        $this->get('/admin/point-rules')->assertOk();

        // Admin panel is separated from Staf BK panel
        $this->get('/bk/dashboard')->assertForbidden();
        $this->get('/bk/student-points/create')->assertForbidden();

        $this->post('/admin/users', [
            'name' => 'Guru BK Baru',
            'email' => 'gurubk@example.com',
            'password' => 'password123',
            'role' => 'staf_bk',
        ])->assertRedirect();

        $newUser = User::where('email', 'gurubk@example.com')->firstOrFail();
        $this->assertTrue($newUser->hasRole('staf_bk'));

        $this->delete("/admin/students/{$student->id}")
            ->assertRedirect(route('students.index'));

        $this->assertFalse($student->fresh()->is_active);

        $this->patch("/admin/students/{$student->id}/toggle-status")
            ->assertRedirect();

        $this->assertTrue($student->fresh()->is_active);
    }

    public function test_staf_bk_has_dedicated_panel_and_cannot_access_admin_routes(): void
    {
        $stafBk = $this->createUserWithRole('staf_bk');
        $this->actingAs($stafBk);

        $this->get('/bk/dashboard')->assertOk();
        $this->get('/bk/students')->assertOk();
        $this->get('/bk/student-points')->assertOk();
        $this->get('/bk/student-points/create')->assertOk();

        $this->get('/dashboard')->assertForbidden();
        $this->get('/admin/users')->assertForbidden();
        $this->get('/admin/point-rules')->assertForbidden();
        $this->get('/admin/students')->assertForbidden();
    }

    public function test_point_rule_cannot_be_deleted_when_used_in_history(): void
    {
        $student = $this->createStudent();
        $rule = PointRule::create([
            'nama' => 'Terlambat',
            'type' => 'penalty',
            'kategori' => 'ringan',
            'point' => 10,
            'is_active' => true,
        ]);

        // Staf BK records the point
        $stafBk = $this->createUserWithRole('staf_bk');
        $this->actingAs($stafBk);
        $this->post('/bk/student-points', [
            'student_id' => $student->id,
            'point_rule_id' => $rule->id,
            'tanggal' => now()->toDateString(),
            'keterangan' => 'Datang terlambat',
        ])->assertRedirect(route('bk.student-points.create'));

        $this->assertEquals(90, $student->fresh()->total_poin);

        // Admin tries to delete used rule
        $admin = $this->createUserWithRole('admin');
        $this->actingAs($admin);
        $this->delete("/admin/point-rules/{$rule->id}")
            ->assertSessionHas('error');

        $this->assertDatabaseHas('point_rules', ['id' => $rule->id]);
    }

    public function test_sp_notification_sends_only_when_level_escalates(): void
    {
        config([
            'services.fonnte.token' => 'test-token',
            'services.fonnte.url' => 'https://api.fonnte.com/send',
        ]);

        Http::fake([
            'https://api.fonnte.com/send' => Http::response(['status' => true], 200),
        ]);

        $stafBk = $this->createUserWithRole('staf_bk');
        $this->actingAs($stafBk);

        $student = $this->createStudent(['total_poin' => 80, 'sp_level' => 0]);

        $penalty = PointRule::create([
            'nama' => 'Pelanggaran Sedang',
            'type' => 'penalty',
            'kategori' => 'sedang',
            'point' => 10,
            'is_active' => true,
        ]);

        $reward = PointRule::create([
            'nama' => 'Juara Lomba',
            'type' => 'reward',
            'kategori' => 'ringan',
            'point' => 5,
            'is_active' => true,
        ]);

        $this->post('/bk/student-points', [
            'student_id' => $student->id,
            'point_rule_id' => $penalty->id,
            'tanggal' => now()->toDateString(),
        ]);

        $this->assertEquals(70, $student->fresh()->total_poin);
        $this->assertEquals(1, $student->fresh()->sp_level);

        $this->post('/bk/student-points', [
            'student_id' => $student->id,
            'point_rule_id' => $reward->id,
            'tanggal' => now()->toDateString(),
        ]);

        $this->assertEquals(75, $student->fresh()->total_poin);
        $this->assertEquals(0, $student->fresh()->sp_level);

        Http::assertSentCount(1);
    }

    public function test_root_route_renders_login_for_guests_and_redirects_by_role(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('auth/login'));

        $admin = $this->createUserWithRole('admin');
        $this->actingAs($admin)->get('/')->assertRedirect('/dashboard');

        $stafBk = $this->createUserWithRole('staf_bk');
        $this->actingAs($stafBk)->get('/')->assertRedirect('/bk/dashboard');

        $siswa = $this->createUserWithRole('siswa');
        $this->actingAs($siswa)->get('/')->assertRedirect('/student/dashboard');
    }

    public function test_student_logs_in_via_unified_login_using_nisn_and_is_restricted_to_portal(): void
    {
        $student = $this->createStudent();

        $this->get('/student/login')->assertNotFound();

        $this->post('/login', [
            'email' => $student->nisn,
            'password' => '2009-05-10',
        ])->assertRedirect('/student/dashboard');

        $this->get('/student/dashboard')->assertOk();
        $this->get('/dashboard')->assertForbidden();
        $this->get('/bk/dashboard')->assertForbidden();
        $this->get('/admin/users')->assertForbidden();
    }
}
