<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['admin']);

        $stafBk = User::firstOrCreate(
            ['email' => 'bk@example.com'],
            [
                'name' => 'Staf BK',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $stafBk->syncRoles(['staf_bk']);

        $siswaUser = User::firstOrCreate(
            ['email' => 'siswa@example.com'],
            [
                'name' => 'Budi Santoso',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $siswaUser->syncRoles(['siswa']);

        Student::firstOrCreate(
            ['nisn' => '0081234567'],
            [
                'user_id' => $siswaUser->id,
                'nama_lengkap' => 'Budi Santoso',
                'jenis_kelamin' => 'L',
                'tanggal_lahir' => '2009-05-10',
                'kelas' => 'VIII',
                'rombel' => 'A',
                'tahun_ajaran' => '2025/2026',
                'no_hp' => '6281234567890',
                'total_poin' => 100,
                'sp_level' => 0,
                'is_active' => true,
            ]
        );
    }
}
