<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PointRuleRequest;
use App\Models\PointRule;
use Inertia\Inertia;

class PointRuleController extends Controller
{
    /**
     * Tampilkan daftar aturan poin
     */
    public function index()
    {
        return Inertia::render('admin/point-rules/index', [
            'rules' => PointRule::orderBy('type')
                ->orderBy('kategori')
                ->get(),
        ]);
    }

    /**
     * Form tambah aturan poin
     */
    public function create()
    {
        return Inertia::render('admin/point-rules/create');
    }

    /**
     * Simpan aturan poin baru
     */
    public function store(PointRuleRequest $request)
    {
        PointRule::create($request->validated());

        return redirect()->route('admin.point-rules.index')
            ->with('success', 'Aturan poin berhasil ditambahkan');
    }

    /**
     * Form edit aturan poin
     */
    public function edit(PointRule $pointRule)
    {
        return Inertia::render('admin/point-rules/edit', [
            'rule' => $pointRule,
        ]);
    }

    /**
     * Update aturan poin
     */
    public function update(PointRuleRequest $request, PointRule $pointRule)
    {
        $pointRule->update($request->validated());

        return redirect()->route('admin.point-rules.index')
            ->with('success', 'Aturan poin berhasil diperbarui');
    }

    /**
     * Hapus aturan poin
     */
    public function destroy(PointRule $pointRule)
    {
        $pointRule->delete();

        return back()->with('success', 'Aturan poin dihapus');
    }
}
