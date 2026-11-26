<?php

namespace App\Services;

use App\Models\Student;

class StudentPointService
{
    /**
     * Determine SP level from total points:
     * 0 = Aman (>= 75), 1 = SP 1 (50..74), 2 = SP 2 (25..49), 3 = SP 3 (< 25).
     */
    public function resolveSpLevel(int $totalPoin): int
    {
        if ($totalPoin < 25) {
            return 3;
        }

        if ($totalPoin < 50) {
            return 2;
        }

        if ($totalPoin < 75) {
            return 1;
        }

        return 0;
    }

    /**
     * Sync student's SP level and send WhatsApp notification only when SP level escalates.
     */
    public function syncSpLevelAndNotify(Student $student, FonnteService $fonnte): void
    {
        $previousLevel = (int) ($student->sp_level ?? 0);
        $newLevel = $this->resolveSpLevel((int) $student->total_poin);

        if ($newLevel !== $previousLevel) {
            $student->sp_level = $newLevel;
            $student->save();
        }

        if ($newLevel > $previousLevel && ! empty($student->no_hp)) {
            $spLabels = [
                1 => 'SP 1 (Surat Peringatan 1)',
                2 => 'SP 2 (Surat Peringatan 2)',
                3 => 'SP 3 (Surat Peringatan 3)',
            ];

            $namaSekolah = config('app.name', 'SIAKAD Sekolah');
            $spLabel = $spLabels[$newLevel] ?? "SP {$newLevel}";

            $message = "*PEMBERITAHUAN PELANGGARAN TATA TERTIB*\n".
                       "🏛️ _{$namaSekolah}_\n\n".
                       "Yth. Orang Tua/Wali dari:\n".
                       "👤 *{$student->nama_lengkap}* ({$student->kelas} {$student->rombel})\n\n".
                       "Dengan ini kami sampaikan bahwa siswa yang bersangkutan telah memenuhi kriteria pembinaan disiplin dengan rincian:\n\n".
                       "----------------------------------\n".
                       "🏷️ Status Sanksi : *{$spLabel}*\n".
                       "📊 Poin Saat Ini : ```{$student->total_poin} / 100```\n".
                       "----------------------------------\n\n".
                       "Mohon perhatian dan kerja sama Bapak/Ibu untuk membimbing putra/putrinya agar tidak mengulangi pelanggaran.\n\n".
                       "Terima kasih.\n".
                       '_— Manajemen Kesiswaan & BK_';

            $fonnte->send($student->no_hp, $message);
        }
    }

    public function handleSp1Notification(Student $student, FonnteService $fonnte): void
    {
        $this->syncSpLevelAndNotify($student, $fonnte);
    }
}
