<?php

namespace App\Services;
use App\Models\Student;

class StudentPointService
{
    public function handleSp1Notification(Student $student, FonnteService $fonnte): void
    {
        if ($student->total_poin < 75 && ! empty($student->no_hp)) {

            $namaSekolah = 'SMA NEGERI CONTOH';

            $message = "*PEMBERITAHUAN PELANGGARAN TATA TERTIB*\n".
                       "🏛️ _{$namaSekolah}_\n\n".
                       "Yth. Orang Tua/Wali dari:\n".
                       "👤 *{$student->nama_lengkap}*\n\n".
                       "Dengan ini kami sampaikan bahwa siswa yang bersangkutan telah memenuhi kriteria pelanggaran disiplin dengan rincian:\n\n".
                       "----------------------------------\n".
                       "🏷️ Status Sanksi : *SP 1 (Surat Peringatan 1)*\n".
                       "📊 Poin Saat Ini : ```{$student->total_poin}```\n".
                       "----------------------------------\n\n".
                       "Mohon perhatian dan kerja sama Bapak/Ibu untuk membimbing putra/putrinya agar tidak mengulangi pelanggaran.\n\n".
                       "Terima kasih.\n".
                       '_— Manajemen Kesiswaan & BK_';

            $fonnte->send($student->no_hp, $message);
        }
    }
}
