import React from 'react';
import { Head, useForm } from '@inertiajs/react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Icons
import { School, LogIn, Calendar, User } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        nisn: '',
        tanggal_lahir: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/student/login/submit');
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
            <Head title="Login Siswa" />

            {/* Container Utama */}
            <div className="w-full max-w-md space-y-6">

                {/* Brand / Logo Area */}
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <School className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">Portal Siswa</h1>
                        <p className="text-sm text-muted-foreground">
                            Sistem Monitoring Poin & Prestasi Siswa
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="border-muted/60 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Masuk Akun</CardTitle>
                        <CardDescription>
                            Silakan masukkan NISN dan Tanggal Lahir untuk melanjutkan.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">

                            {/* Input NISN */}
                            <div className="space-y-2">
                                <Label htmlFor="nisn" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    NISN
                                </Label>
                                <Input
                                    id="nisn"
                                    type="text"
                                    placeholder="Contoh: 005xxxxxxx"
                                    value={data.nisn}
                                    onChange={(e) => setData('nisn', e.target.value)}
                                    className={errors.nisn ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    autoFocus
                                />
                                {errors.nisn && (
                                    <p className="text-xs text-red-500 font-medium animate-pulse">
                                        {errors.nisn}
                                    </p>
                                )}
                            </div>

                            {/* Input Tanggal Lahir */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_lahir" className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    Tanggal Lahir
                                </Label>
                                <Input
                                    id="tanggal_lahir"
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                    className={errors.tanggal_lahir ? "border-red-500 focus-visible:ring-red-500 block" : "block"}
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Format: Bulan/Hari/Tahun (atau sesuai pengaturan perangkat).
                                </p>
                                {errors.tanggal_lahir && (
                                    <p className="text-xs text-red-500 font-medium animate-pulse">
                                        {errors.tanggal_lahir}
                                    </p>
                                )}
                            </div>

                            {/* Tombol Submit */}
                            <Button
                                type="submit"
                                className="w-full mt-4"
                                size="lg"
                                disabled={processing}
                            >
                                {processing ? (
                                    'Memproses...'
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" /> Masuk Sekarang
                                    </>
                                )}
                            </Button>

                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t bg-muted/20 py-4">
                        <p className="text-xs text-muted-foreground text-center">
                            Mengalami kendala saat login? <br/>
                            Hubungi Wali Kelas atau Admin Tata Usaha.
                        </p>
                    </CardFooter>
                </Card>

                {/* Footer Copyright */}
                <p className="text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Sekolah Anda. All rights reserved.
                </p>
            </div>
        </div>
    );
}
