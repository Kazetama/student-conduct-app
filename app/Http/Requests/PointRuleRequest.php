<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PointRuleRequest extends FormRequest
{
    /**
     * Tentukan apakah user diizinkan melakukan request ini
     */
    public function authorize(): bool
    {
        // Kita pakai true agar tidak memicu 403
        return true;
    }

    /**
     * Aturan validasi untuk store & update
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'type' => 'required|in:reward,penalty',
            'kategori' => 'required|in:ringan,sedang,berat,semester',
            'point' => 'required|integer',
            'max_per_period' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ];
    }
}
