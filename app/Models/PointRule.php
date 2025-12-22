<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointRule extends Model
{
    protected $fillable = [
        'nama',
        'type',
        'kategori',
        'point',
        'max_per_period',
        'is_active',
    ];

    public function pointHistories()
    {
        return $this->hasMany(StudentPoint::class);
    }

    public function recalculateTotalPoint(): int
    {
        return $this->pointHistories()->sum('point');
    }
}
