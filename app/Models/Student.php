<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'nama_lengkap',
        'nisn',
        'jenis_kelamin',
        'tanggal_lahir',
        'kelas',
        'rombel',
        'tahun_ajaran',
        'no_hp',
        'total_poin',
        'is_active',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'is_active'     => 'boolean',
        'total_poin'    => 'integer',
    ];
}
