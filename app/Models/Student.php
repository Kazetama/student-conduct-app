<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Student extends Authenticatable
{
    use HasFactory, Notifiable;

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
        'is_active' => 'boolean',
        'total_poin' => 'integer',
    ];

    protected $hidden = [
        'remember_token',
    ];

    /**
     * Student TIDAK pakai password
     * Method ini WAJIB agar Auth Laravel tidak error
     */
    public function getAuthPassword()
    {
        return null;
    }
}
