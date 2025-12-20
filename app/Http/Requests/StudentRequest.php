<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_lengkap' => 'required|string|max:255',
            'nisn' => [
                'required',
                'digits:10',
                Rule::unique('students', 'nisn')
                    ->ignore($this->student),
            ],
            'jenis_kelamin' => 'required|in:L,P',
            'tanggal_lahir' => 'required|date|before:today',
            'kelas' => 'required|string|max:10',
            'rombel' => 'required|string|max:10',
            'tahun_ajaran' => 'required|string|max:9',
            'no_hp' => 'nullable|string|max:15',
        ];
    }

    public function messages(): array
    {
        return [
            'nisn.unique' => 'NISN sudah terdaftar.',
            'nisn.digits' => 'NISN harus 10 digit.',
            'tanggal_lahir.before' => 'Tanggal lahir tidak valid.',
            'jenis_kelamin.in' => 'Jenis kelamin harus L atau P.',
        ];
    }
}
