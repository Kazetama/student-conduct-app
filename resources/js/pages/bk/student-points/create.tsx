import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    FileText,
    Gavel,
    Save,
    Search,
    User,
} from 'lucide-react';
import React, { useState } from 'react';

interface Student {
    id: number;
    nama_lengkap: string;
    nisn: string;
    kelas: string;
    rombel: string;
    total_poin: number;
}

interface PointRule {
    id: number;
    nama: string;
    type: 'reward' | 'penalty';
    point: number;
}

export default function Create({
    students,
    rules,
    preselectedStudentId,
}: {
    students: Student[];
    rules: PointRule[];
    preselectedStudentId?: string | number | null;
}) {
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const initialStudent = preselectedStudentId
        ? students.find((s) => s.id.toString() === String(preselectedStudentId))
        : undefined;

    const [query, setQuery] = useState(initialStudent?.nama_lengkap ?? '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
        hasErrors,
    } = useForm({
        student_id: initialStudent ? initialStudent.id.toString() : '',
        point_rule_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
    });

    const filteredStudents = students.filter(
        (s) =>
            s.nama_lengkap.toLowerCase().includes(query.toLowerCase()) ||
            s.nisn.includes(query),
    );

    const handleSelectStudent = (student: Student) => {
        setData('student_id', student.id.toString());
        setQuery(student.nama_lengkap);
        setIsDropdownOpen(false);
    };

    const selectedRule = rules.find(
        (r) => r.id.toString() === data.point_rule_id,
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bk/student-points', {
            preserveScroll: true,
            onSuccess: () => {
                reset('point_rule_id', 'keterangan');
                setQuery('');
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard BK', href: '/bk/dashboard' },
                { title: 'Input Poin', href: '/bk/student-points/create' },
            ]}
        >
            <Head title="Input Poin Siswa - Staf BK" />

            <div className="flex flex-1 justify-center p-4 md:p-8">
                <div className="w-full space-y-6">
                    {(recentlySuccessful || flash?.success) && (
                        <Alert className="animate-in fade-in slide-in-from-top-2 border-green-500 bg-green-50 text-green-900">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle>Berhasil!</AlertTitle>
                            <AlertDescription>
                                {flash?.success ||
                                    'Data poin siswa berhasil disimpan ke sistem.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {(hasErrors || flash?.error) && (
                        <Alert
                            variant="destructive"
                            className="animate-in fade-in slide-in-from-top-2"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Gagal Menyimpan</AlertTitle>
                            <AlertDescription>
                                {flash?.error ||
                                    'Mohon periksa kembali inputan Anda, terdapat kesalahan data.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={submit}>
                        <Card className="shadow-md">
                            <CardHeader className="border-b bg-muted/30 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                        <Gavel className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">
                                            Catat Pelanggaran / Prestasi
                                        </CardTitle>
                                        <CardDescription>
                                            Input poin siswa akan terakumulasi
                                            secara otomatis.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Pilih Siswa{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>

                                    <div className="relative">
                                        <div className="relative">
                                            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Cari nama lengkap atau NISN..."
                                                className={`pl-9 ${errors.student_id ? 'border-red-500 ring-red-500' : ''}`}
                                                value={query}
                                                onChange={(e) => {
                                                    setQuery(e.target.value);
                                                    setIsDropdownOpen(true);
                                                    if (!e.target.value)
                                                        setData(
                                                            'student_id',
                                                            '',
                                                        );
                                                }}
                                                onFocus={() =>
                                                    setIsDropdownOpen(true)
                                                }
                                            />
                                        </div>

                                        {isDropdownOpen && query && (
                                            <div className="animate-in fade-in zoom-in-95 absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-lg duration-100">
                                                {filteredStudents.length > 0 ? (
                                                    filteredStudents.map(
                                                        (s) => (
                                                            <div
                                                                key={s.id}
                                                                className="flex cursor-pointer items-center justify-between border-b px-4 py-3 transition-colors last:border-0 hover:bg-muted"
                                                                onClick={() =>
                                                                    handleSelectStudent(
                                                                        s,
                                                                    )
                                                                }
                                                            >
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        {
                                                                            s.nama_lengkap
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        NISN:{' '}
                                                                        {s.nisn}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="mb-1 block text-xs"
                                                                    >
                                                                        {
                                                                            s.kelas
                                                                        }{' '}
                                                                        {
                                                                            s.rombel
                                                                        }
                                                                    </Badge>
                                                                    <span
                                                                        className={`text-xs font-bold ${s.total_poin >= 90 ? 'text-green-600' : s.total_poin >= 50 ? 'text-yellow-600' : 'text-red-600'}`}
                                                                    >
                                                                        {
                                                                            s.total_poin
                                                                        }{' '}
                                                                        Poin
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                                        Data siswa tidak
                                                        ditemukan.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {isDropdownOpen && (
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() =>
                                                    setIsDropdownOpen(false)
                                                }
                                            />
                                        )}

                                        {errors.student_id && (
                                            <p className="mt-1 text-xs font-medium text-red-500">
                                                Data siswa wajib dipilih dari
                                                daftar.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            Jenis Pelanggaran / Prestasi{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.point_rule_id}
                                            onValueChange={(val) =>
                                                setData('point_rule_id', val)
                                            }
                                        >
                                            <SelectTrigger
                                                className={
                                                    errors.point_rule_id
                                                        ? 'border-red-500'
                                                        : ''
                                                }
                                            >
                                                <SelectValue placeholder="Pilih kategori..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rules.map((r) => (
                                                    <SelectItem
                                                        key={r.id}
                                                        value={r.id.toString()}
                                                    >
                                                        <div className="flex w-full min-w-[200px] items-center justify-between gap-4">
                                                            <span className="truncate">
                                                                {r.nama}
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    r.type ===
                                                                    'penalty'
                                                                        ? 'border-red-200 bg-red-50 text-red-700'
                                                                        : 'border-green-200 bg-green-50 text-green-700'
                                                                }
                                                            >
                                                                {r.type ===
                                                                'penalty'
                                                                    ? '-'
                                                                    : '+'}
                                                                {Math.abs(
                                                                    r.point,
                                                                )}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {selectedRule && (
                                            <p
                                                className={`mt-1 text-xs ${selectedRule.type === 'penalty' ? 'text-red-600' : 'text-green-600'}`}
                                            >
                                                *Siswa akan mendapatkan{' '}
                                                {selectedRule.type === 'penalty'
                                                    ? 'pengurangan'
                                                    : 'penambahan'}{' '}
                                                sebesar{' '}
                                                <b>
                                                    {Math.abs(
                                                        selectedRule.point,
                                                    )}{' '}
                                                    poin
                                                </b>
                                                .
                                            </p>
                                        )}
                                        {errors.point_rule_id && (
                                            <p className="text-xs font-medium text-red-500">
                                                {errors.point_rule_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            Tanggal Kejadian{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="date"
                                            value={data.tanggal}
                                            onChange={(e) =>
                                                setData(
                                                    'tanggal',
                                                    e.target.value,
                                                )
                                            }
                                            className={
                                                errors.tanggal
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        {errors.tanggal && (
                                            <p className="text-xs font-medium text-red-500">
                                                {errors.tanggal}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Keterangan Tambahan</Label>
                                    <Textarea
                                        placeholder="Contoh: Terlambat karena ban bocor, atau detail kejadian lainnya..."
                                        className="resize-none"
                                        rows={3}
                                        value={data.keterangan}
                                        onChange={(e) =>
                                            setData(
                                                'keterangan',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Opsional. Berguna untuk riwayat detail.
                                    </p>
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-between border-t bg-muted/10 p-6">
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => window.history.back()}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-[140px]"
                                >
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
