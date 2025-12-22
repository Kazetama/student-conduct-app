import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

import { ChevronLeft, Save, Search, CheckCircle2, User, X } from 'lucide-react';

interface Student {
    id: number;
    nama_lengkap: string;
    nisn: string;
    total_poin: number;
}

interface PointRule {
    id: number;
    nama: string;
    type: 'reward' | 'penalty';
    point: number;
}

export default function Create({ students, rules }: {
    students: Student[];
    rules: PointRule[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Input Poin', href: '#' },
    ];

    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    const [toast, setToast] = useState<string | null>(null);

    const [query, setQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        point_rule_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setToast(flash.success);
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const filteredStudents = students.filter((s) =>
        s.nama_lengkap.toLowerCase().includes(query.toLowerCase()) ||
        s.nisn.includes(query)
    );

    const handleSelectStudent = (student: Student) => {
        setData('student_id', student.id.toString());
        setQuery(`${student.nama_lengkap} (${student.nisn})`);
        setIsDropdownOpen(false);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/student-points', {
            onSuccess: () => {
                reset();
                setQuery('');
                setData('tanggal', new Date().toISOString().split('T')[0]);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Input Poin Siswa" />

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                    <div className="flex items-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-white shadow-xl">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">{toast}</span>
                        <button onClick={() => setToast(null)} className="ml-2 text-green-100 hover:text-white">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto p-6">
                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Pelanggaran / Prestasi</CardTitle>
                            <CardDescription>
                                Masukkan data poin siswa berdasarkan aturan yang berlaku.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">

                            {/* SECTION 1: PILIH SISWA (Custom Combobox Style) */}
                            <div className="space-y-2 relative">
                                <Label htmlFor="student_search">Cari Siswa <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="student_search"
                                        placeholder="Ketik Nama atau NISN..."
                                        className="pl-9"
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            setIsDropdownOpen(true);
                                            // Reset ID jika user mengetik ulang
                                            if (e.target.value === '') setData('student_id', '');
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        autoComplete="off"
                                    />
                                </div>

                                {/* Dropdown Suggestion */}
                                {isDropdownOpen && query && (
                                    <div className="absolute z-10 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md max-h-60 overflow-y-auto">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((s) => (
                                                <div
                                                    key={s.id}
                                                    className="flex flex-col px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                                                    onClick={() => handleSelectStudent(s)}
                                                >
                                                    <span className="font-medium">{s.nama_lengkap}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        NISN: {s.nisn} • Poin Saat Ini: {s.total_poin}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-sm text-center text-muted-foreground">
                                                Siswa tidak ditemukan.
                                            </div>
                                        )}
                                    </div>
                                )}
                                {errors.student_id && <p className="text-xs text-red-500">Siswa wajib dipilih dari daftar.</p>}
                            </div>

                            <Separator />

                            {/* SECTION 2: ATURAN & TANGGAL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Aturan */}
                                <div className="space-y-2">
                                    <Label>Jenis Aturan <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.point_rule_id}
                                        onValueChange={(val) => setData('point_rule_id', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Aturan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rules.map((r) => (
                                                <SelectItem key={r.id} value={r.id.toString()}>
                                                    <span className="flex items-center justify-between w-full gap-2">
                                                        <span>{r.nama}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                                            r.type === 'penalty'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-green-100 text-green-700'
                                                        }`}>
                                                            {r.type === 'penalty' ? '-' : '+'}{r.point}
                                                        </span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.point_rule_id && <p className="text-xs text-red-500">{errors.point_rule_id}</p>}
                                </div>

                                {/* Tanggal */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal">Tanggal Kejadian <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="tanggal"
                                        type="date"
                                        value={data.tanggal}
                                        onChange={(e) => setData('tanggal', e.target.value)}
                                    />
                                    {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal}</p>}
                                </div>
                            </div>

                            {/* SECTION 3: KETERANGAN */}
                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan Tambahan (Opsional)</Label>
                                <Textarea
                                    id="keterangan"
                                    placeholder="Kronologi kejadian atau catatan tambahan..."
                                    className="resize-none"
                                    rows={4}
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                />
                            </div>

                        </CardContent>

                        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
                            <Button variant="outline" type="button" onClick={() => window.history.back()}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                            <Button type="submit" disabled={processing} className="min-w-[120px]">
                                {processing ? (
                                    'Menyimpan...'
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan Data
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
