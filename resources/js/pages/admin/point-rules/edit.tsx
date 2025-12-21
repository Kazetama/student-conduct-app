import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

// Icons
import { ChevronLeft, Save } from 'lucide-react';

interface PointRule {
    id: number;
    nama: string;
    type: 'penalty' | 'reward';
    kategori: 'ringan' | 'sedang' | 'berat' | 'semester';
    point: number;
    max_per_period?: number;
    is_active: boolean;
}

interface PointRuleForm {
    nama: string;
    type: 'penalty' | 'reward';
    kategori: 'ringan' | 'sedang' | 'berat' | 'semester';
    point: number;
    max_per_period: number | '';
    is_active: boolean;
}

export default function Edit({ rule }: { rule: PointRule }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/' },
        { title: 'Aturan Poin', href: '/admin/point-rules' },
        { title: 'Edit', href: `/admin/point-rules/${rule.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm<PointRuleForm>({
        nama: rule.nama,
        type: rule.type,
        kategori: rule.kategori,
        point: rule.point,
        max_per_period: rule.max_per_period ?? '',
        is_active: rule.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/point-rules/${rule.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Aturan Poin" />

            <div className="container mx-auto p-6">
                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Aturan Poin</CardTitle>
                            <CardDescription>
                                Perbarui detail aturan pelanggaran atau prestasi.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Aturan <span className="text-red-500">*</span></Label>
                                <Input
                                    id="nama"
                                    placeholder="Contoh: Terlambat Masuk Sekolah"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className={errors?.nama ? "border-red-500" : ""}
                                />
                                {errors?.nama && <p className="text-xs text-red-500">{errors.nama}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Jenis Aturan</Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(val) => setData('type', val as 'penalty' | 'reward')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="penalty">Pelanggaran (Poin Negatif)</SelectItem>
                                            <SelectItem value="reward">Prestasi (Poin Positif)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Kategori Berat</Label>
                                    <Select
                                        value={data.kategori}
                                        onValueChange={(val) => setData('kategori', val as 'ringan' | 'sedang' | 'berat' | 'semester')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ringan">Ringan</SelectItem>
                                            <SelectItem value="sedang">Sedang</SelectItem>
                                            <SelectItem value="berat">Berat</SelectItem>
                                            <SelectItem value="semester">Khusus Semester</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nilai Poin */}
                                <div className="space-y-2">
                                    <Label htmlFor="point">Bobot Poin <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="point"
                                        type="number"
                                        placeholder="Contoh: 5"
                                        value={data.point}
                                        onChange={(e) => setData('point', Number(e.target.value))}
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Masukkan angka positif. Sistem otomatis menyesuaikan +/-.
                                    </p>
                                </div>

                                {/* Max Per Periode */}
                                <div className="space-y-2">
                                    <Label htmlFor="max_per_period">Batas Maksimal (Opsional)</Label>
                                    <Input
                                        id="max_per_period"
                                        type="number"
                                        placeholder="Kosongkan jika tidak ada batas"
                                        value={data.max_per_period}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData('max_per_period', value === '' ? '' : Number(value));
                                        }}
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Berapa kali aturan ini boleh diinput dalam satu periode.
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Status Aktif Switch */}
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Status Aturan</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Jika nonaktif, aturan ini tidak akan muncul saat input pelanggaran.
                                    </div>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                            </div>

                        </CardContent>

                        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
                            <Button variant="outline" asChild>
                                <Link href="/admin/point-rules">
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
