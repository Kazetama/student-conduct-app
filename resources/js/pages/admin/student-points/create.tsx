import React, { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Icons
import {
    ChevronLeft,
    Save,
    Search,
    CheckCircle2,
    AlertCircle,
    User,
    Calendar,
    FileText,
    Gavel
} from 'lucide-react';

interface Student {
    id: number;
    nama_lengkap: string;
    nisn: string;
    kelas: string; // Asumsi ada data kelas
    rombel: string;
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
    // --- State & Hooks ---
    const { flash } = usePage<{ flash?: { success?: string, error?: string } }>().props;
    const [query, setQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Form Handling
    const { data, setData, post, processing, errors, reset, recentlySuccessful, hasErrors } = useForm({
        student_id: '',
        point_rule_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
    });

    // Helper: Cari Siswa
    const filteredStudents = students.filter((s) =>
        s.nama_lengkap.toLowerCase().includes(query.toLowerCase()) ||
        s.nisn.includes(query)
    );

    const handleSelectStudent = (student: Student) => {
        setData('student_id', student.id.toString());
        setQuery(`${student.nama_lengkap}`);
        setIsDropdownOpen(false);
    };

    // Helper: Format Aturan
    const selectedRule = rules.find(r => r.id.toString() === data.point_rule_id);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/student-points', {
            preserveScroll: true,
            onSuccess: () => {
                reset('point_rule_id', 'keterangan');
                setQuery('');
                // Tanggal tidak di-reset agar mudah input massal di hari yang sama
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Input Poin', href: '/admin/student-points/create' },
            ]}
        >
            <Head title="Input Poin Siswa" />

            <div className="flex flex-1 justify-center p-4 md:p-8">
                <div className="w-full space-y-6">

                    {(recentlySuccessful || flash?.success) && (
                        <Alert className="border-green-500 bg-green-50 text-green-900 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle>Berhasil!</AlertTitle>
                            <AlertDescription>
                                {flash?.success || "Data poin siswa berhasil disimpan ke sistem."}
                            </AlertDescription>
                        </Alert>
                    )}

                    {(hasErrors || flash?.error) && (
                        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Gagal Menyimpan</AlertTitle>
                            <AlertDescription>
                                {flash?.error || "Mohon periksa kembali inputan Anda, terdapat kesalahan data."}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={submit}>
                        <Card className="shadow-md">
                            <CardHeader className="bg-muted/30 pb-4 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Gavel className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Catat Pelanggaran / Prestasi</CardTitle>
                                        <CardDescription>
                                            Input poin siswa akan terakumulasi secara otomatis.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-6">

                                {/* SECTION 1: SISWA */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Pilih Siswa <span className="text-red-500">*</span>
                                    </Label>

                                    <div className="relative">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Cari nama lengkap atau NISN..."
                                                className={`pl-9 ${errors.student_id ? 'border-red-500 ring-red-500' : ''}`}
                                                value={query}
                                                onChange={(e) => {
                                                    setQuery(e.target.value);
                                                    setIsDropdownOpen(true);
                                                    if (!e.target.value) setData('student_id', '');
                                                }}
                                                onFocus={() => setIsDropdownOpen(true)}
                                            />
                                        </div>

                                        {/* Custom Dropdown Result */}
                                        {isDropdownOpen && query && (
                                            <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                                {filteredStudents.length > 0 ? (
                                                    filteredStudents.map((s) => (
                                                        <div
                                                            key={s.id}
                                                            className="flex items-center justify-between px-4 py-3 hover:bg-muted cursor-pointer transition-colors border-b last:border-0"
                                                            onClick={() => handleSelectStudent(s)}
                                                        >
                                                            <div>
                                                                <p className="font-medium text-sm">{s.nama_lengkap}</p>
                                                                <p className="text-xs text-muted-foreground">NISN: {s.nisn}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <Badge variant="outline" className="text-xs mb-1 block">
                                                                    {s.kelas} {s.rombel}
                                                                </Badge>
                                                                <span className={`text-xs font-bold ${s.total_poin >= 50 ? 'text-red-600' : 'text-green-600'}`}>
                                                                    {s.total_poin} Poin
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-sm text-center text-muted-foreground">
                                                        Data siswa tidak ditemukan.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {isDropdownOpen && (
                                            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                                        )}

                                        {errors.student_id && (
                                            <p className="text-xs text-red-500 mt-1 font-medium">Data siswa wajib dipilih dari daftar.</p>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* SECTION 2: ATURAN & WAKTU */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Select Aturan */}
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            Jenis Pelanggaran / Prestasi <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.point_rule_id}
                                            onValueChange={(val) => setData('point_rule_id', val)}
                                        >
                                            <SelectTrigger className={errors.point_rule_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih kategori..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rules.map((r) => (
                                                    <SelectItem key={r.id} value={r.id.toString()}>
                                                        <div className="flex items-center justify-between w-full min-w-[200px] gap-4">
                                                            <span className="truncate">{r.nama}</span>
                                                            <Badge
                                                                variant="outline"
                                                                className={r.type === 'penalty' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}
                                                            >
                                                                {r.type === 'penalty' ? '-' : '+'}{r.point}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {/* Preview Poin yang akan diberikan */}
                                        {selectedRule && (
                                            <p className={`text-xs mt-1 ${selectedRule.type === 'penalty' ? 'text-red-600' : 'text-green-600'}`}>
                                                *Siswa akan mendapatkan {selectedRule.type === 'penalty' ? 'penambahan' : 'pengurangan'} sebesar <b>{selectedRule.point} poin</b>.
                                            </p>
                                        )}
                                        {errors.point_rule_id && <p className="text-xs text-red-500 font-medium">{errors.point_rule_id}</p>}
                                    </div>

                                    {/* Input Tanggal */}
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            Tanggal Kejadian <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            type="date"
                                            value={data.tanggal}
                                            onChange={(e) => setData('tanggal', e.target.value)}
                                            className={errors.tanggal ? 'border-red-500' : ''}
                                        />
                                        {errors.tanggal && <p className="text-xs text-red-500 font-medium">{errors.tanggal}</p>}
                                    </div>
                                </div>

                                {/* SECTION 3: KETERANGAN */}
                                <div className="space-y-3">
                                    <Label>Keterangan Tambahan</Label>
                                    <Textarea
                                        placeholder="Contoh: Terlambat karena ban bocor, atau detail kejadian lainnya..."
                                        className="resize-none"
                                        rows={3}
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Opsional. Berguna untuk riwayat detail.</p>
                                </div>

                            </CardContent>

                            <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
                                <Button variant="ghost" type="button" onClick={() => window.history.back()}>
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="min-w-[140px]">
                                    {processing ? (
                                        <>Memproses...</>
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
            </div>
        </AppLayout>
    );
}
