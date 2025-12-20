import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Icons
import { ChevronLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        nisn: '',
        jenis_kelamin: 'L',
        tanggal_lahir: '',
        kelas: '',
        rombel: '',
        tahun_ajaran: '2024/2025',
        no_hp: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/students', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/' },
                { title: 'Students', href: '/admin/students' },
                { title: 'Create', href: '/admin/students/create' },
            ]}
        >
            <Head title="Tambah Siswa" />

            <div className="container mx-auto p-3">
                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Siswa Baru</CardTitle>
                            <CardDescription>
                                Masukkan informasi lengkap siswa baru untuk ditambahkan ke sistem.
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
                                            placeholder="Contoh: Ahmad Fauzi"
                                            value={data.nama_lengkap}
                                            onChange={(e) => setData('nama_lengkap', e.target.value)}
                                            className={errors.nama_lengkap ? "border-red-500" : ""}
                                        />
                                        {errors.nama_lengkap && <p className="text-xs text-red-500">{errors.nama_lengkap}</p>}
                                    </div>

                                    {/* NISN */}
                                    <div className="space-y-2">
                                        <Label htmlFor="nisn">NISN <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="nisn"
                                            placeholder="10 digit nomor NISN"
                                            value={data.nisn}
                                            onChange={(e) => setData('nisn', e.target.value)}
                                            maxLength={10}
                                            className={errors.nisn ? "border-red-500" : ""}
                                        />
                                        {errors.nisn && <p className="text-xs text-red-500">{errors.nisn}</p>}
                                    </div>

                                    {/* Jenis Kelamin */}
                                    <div className="space-y-2">
                                        <Label>Jenis Kelamin</Label>
                                        <Select
                                            value={data.jenis_kelamin}
                                            onValueChange={(val) => setData('jenis_kelamin', val)}
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
                                            placeholder="Contoh: A, B, atau Unggulan"
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
                                            placeholder="2024/2025"
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
                                            placeholder="08xxxxxxxxxx"
                                            value={data.no_hp}
                                            onChange={(e) => setData('no_hp', e.target.value)}
                                        />
                                        <p className="text-[0.8rem] text-muted-foreground">
                                            Digunakan untuk notifikasi pelanggaran ke orang tua/siswa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
                            <Button variant="outline" asChild>
                                <Link href="/admin/students">
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Kembali
                                </Link>
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
