import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { type Student } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Icons
import { ChevronLeft, Save } from 'lucide-react';

interface Props {
    student: Student;
}

export default function Edit({ student }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_lengkap: student.nama_lengkap,
        nisn: student.nisn,
        jenis_kelamin: student.jenis_kelamin,
        tanggal_lahir: student.tanggal_lahir
            ? student.tanggal_lahir.substring(0, 10)
            : '',
        kelas: student.kelas,
        rombel: student.rombel,
        tahun_ajaran: student.tahun_ajaran,
        no_hp: student.no_hp ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/students/${student.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/' },
                { title: 'Students', href: '/admin/students' },
                { title: 'Edit', href: `/admin/students/${student.id}/edit` },
            ]}
        >
            <Head title={`Edit ${student.nama_lengkap}`} />

            <div className="container mx-auto p-3">
                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Data Siswa</CardTitle>
                            <CardDescription>
                                Perbarui informasi siswa. Pastikan data yang dimasukkan valid.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* BAGIAN 1: DATA PRIBADI */}
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                                    Data Pribadi
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nama Lengkap */}
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_lengkap">Nama Lengkap <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="nama_lengkap"
                                            value={data.nama_lengkap}
                                            onChange={(e) => setData('nama_lengkap', e.target.value)}
                                            className={errors.nama_lengkap ? "border-red-500" : ""}
                                        />
                                        {errors.nama_lengkap && <p className="text-xs text-red-500">{errors.nama_lengkap}</p>}
                                    </div>

                                    {/* NISN (Disabled/Read-only) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="nisn">NISN</Label>
                                        <Input
                                            id="nisn"
                                            value={data.nisn}
                                            disabled
                                            className="bg-muted text-muted-foreground cursor-not-allowed"
                                        />
                                        <p className="text-[0.8rem] text-muted-foreground">
                                            NISN tidak dapat diubah secara langsung.
                                        </p>
                                    </div>

                                    {/* Jenis Kelamin */}
                                    <div className="space-y-2">
                                        <Label>Jenis Kelamin</Label>
                                        <Select
                                            value={data.jenis_kelamin}
                                            onValueChange={(val) => setData('jenis_kelamin', val as 'L' | 'P')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="L">Laki-laki</SelectItem>
                                                <SelectItem value="P">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.jenis_kelamin && <p className="text-xs text-red-500">{errors.jenis_kelamin}</p>}
                                    </div>

                                    {/* Tanggal Lahir */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_lahir">Tanggal Lahir <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="tanggal_lahir"
                                            type="date"
                                            value={data.tanggal_lahir}
                                            onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                            className={errors.tanggal_lahir ? "border-red-500 block" : "block"}
                                        />
                                        {errors.tanggal_lahir && <p className="text-xs text-red-500">{errors.tanggal_lahir}</p>}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* BAGIAN 2: DATA AKADEMIK */}
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                                    Data Akademik & Kontak
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Kelas */}
                                    <div className="space-y-2">
                                        <Label htmlFor="kelas">Kelas <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={data.kelas}
                                            onValueChange={(val) => setData('kelas', val)}
                                        >
                                            <SelectTrigger className={errors.kelas ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Pilih Kelas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="VII">Kelas VII (7)</SelectItem>
                                                <SelectItem value="VIII">Kelas VIII (8)</SelectItem>
                                                <SelectItem value="IX">Kelas IX (9)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.kelas && <p className="text-xs text-red-500">{errors.kelas}</p>}
                                    </div>

                                    {/* Rombel */}
                                    <div className="space-y-2">
                                        <Label htmlFor="rombel">Rombel <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="rombel"
                                            value={data.rombel}
                                            onChange={(e) => setData('rombel', e.target.value)}
                                            className={errors.rombel ? "border-red-500" : ""}
                                        />
                                        {errors.rombel && <p className="text-xs text-red-500">{errors.rombel}</p>}
                                    </div>

                                    {/* Tahun Ajaran */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
                                        <Input
                                            id="tahun_ajaran"
                                            value={data.tahun_ajaran}
                                            onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    {/* No HP */}
                                    <div className="space-y-2 max-w-md">
                                        <Label htmlFor="no_hp">Nomor HP / WhatsApp (Opsional)</Label>
                                        <Input
                                            id="no_hp"
                                            type="tel"
                                            value={data.no_hp}
                                            onChange={(e) => setData('no_hp', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
                            <Button variant="outline" asChild>
                                <Link href="/admin/students">
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Batal
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="min-w-[120px]">
                                {processing ? (
                                    'Menyimpan...'
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan Perubahan
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
