<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PointRuleRequest;
use App\Models\PointRule;
use Inertia\Inertia;

class PointRuleController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/point-rules/index', [
            'rules' => PointRule::orderBy('type')
                ->orderBy('kategori')
                ->orderBy('nama')
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/point-rules/create');
    }

    public function store(PointRuleRequest $request)
    {
        $data = $request->validated();
        $data['point'] = abs((int) $data['point']);

        PointRule::create($data);

        return redirect()->route('admin.point-rules.index')
            ->with('success', 'Aturan poin berhasil ditambahkan.');
    }

    public function edit(PointRule $pointRule)
    {
        return Inertia::render('admin/point-rules/edit', [
            'rule' => $pointRule,
        ]);
    }

    public function update(PointRuleRequest $request, PointRule $pointRule)
    {
        $data = $request->validated();
        $data['point'] = abs((int) $data['point']);

        $pointRule->update($data);

        return redirect()->route('admin.point-rules.index')
            ->with('success', 'Aturan poin berhasil diperbarui.');
    }

    public function destroy(PointRule $pointRule)
    {
        if ($pointRule->pointHistories()->exists()) {
            return back()->with(
                'error',
                'Aturan tidak dapat dihapus karena sudah digunakan dalam riwayat poin siswa. Nonaktifkan saja aturan ini.'
            );
        }

        $pointRule->delete();

        return back()->with('success', 'Aturan poin berhasil dihapus.');
    }
}
