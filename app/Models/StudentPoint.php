<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'point_rule_id',
        'point',
        'periode',
        'keterangan',
        'tanggal',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function pointRule()
    {
        return $this->belongsTo(PointRule::class);
    }
}
