import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Icons
import {
    School,
    ArrowRight,
    Calendar,
    User,
    ShieldCheck,
    Info,
    Loader2
} from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        nisn: '',
        tanggal_lahir: '',
    });

    // State untuk feedback visual tambahan (opsional)
    const [showHelp, setShowHelp] = useState(false);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/student/login/submit');
    }

    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden">
            <Head title="Login Portal Siswa" />

            {/* === BAGIAN KIRI: VISUAL & BRANDING (Desktop Only) === */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white relative">
                {/* Background Pattern/Image Overlay */}
                <div className="absolute inset-0 bg-primary/20 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50" />

                {/* Logo Area */}
                <div className="relative z-10 flex items-center gap-3 text-lg font-medium">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                        <School className="h-6 w-6" />
                    </div>
                    <span>SIAKAD Digital</span>
                </div>

                {/* Quote / Welcome Message */}
                <div className="relative z-10 space-y-4 max-w-md">
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                        Portal Akademik Siswa
                    </Badge>
                    <h1 className="text-4xl font-bold leading-tight tracking-tight">
                        Pantau Prestasi & <br/> Perkembangan Akademik.
                    </h1>
                    <p className="text-zinc-300 text-lg">
                        "Pendidikan adalah tiket ke masa depan. Hari esok dimiliki oleh orang-orang yang mempersiapkannya hari ini."
                    </p>
                </div>

                {/* Footer Visual */}
                <div className="relative z-10 text-sm text-zinc-400 flex justify-between items-center">
                    <p>&copy; 2026 Sekolah Unggulan.</p>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4"/> Data Terenkripsi</span>
                    </div>
                </div>
            </div>

            {/* === BAGIAN KANAN: FORM LOGIN === */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="w-full max-w-[400px] space-y-8">

                    {/* Header Mobile (Logo muncul di sini saat mobile) */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-2">
                        <div className="lg:hidden flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                            <School className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            Selamat Datang
                        </h2>
                        <p className="text-muted-foreground">
                            Masukan identitas siswa untuk mengakses rapor dan poin.
                        </p>
                    </div>

                    {/* Alert Bantuan (Toggle) */}
                    {showHelp && (
                        <Alert className="bg-blue-50 border-blue-200 text-blue-800 animate-in fade-in slide-in-from-top-2">
                            <Info className="h-4 w-4 text-blue-600" />
                            <AlertTitle>Lupa NISN?</AlertTitle>
                            <AlertDescription className="text-xs mt-1">
                                Silakan cek Kartu Pelajar Anda atau hubungi Wali Kelas melalui WhatsApp untuk mendapatkan nomor NISN yang valid.
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={submit} className="space-y-6">

                        {/* Input NISN */}
                        <div className="space-y-2">
                            <Label htmlFor="nisn" className={errors.nisn ? "text-red-500" : ""}>
                                Nomor Induk Siswa Nasional (NISN)
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="nisn"
                                    placeholder="Contoh: 0081234567"
                                    className={`pl-10 h-11 ${errors.nisn ? "border-red-500 focus-visible:ring-red-500 bg-red-50/50" : ""}`}
                                    value={data.nisn}
                                    onChange={(e) => setData('nisn', e.target.value)}
                                    autoFocus
                                />
                            </div>
                            {errors.nisn && <p className="text-xs text-red-500 font-medium">{errors.nisn}</p>}
                        </div>

                        {/* Input Tanggal Lahir */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="tanggal_lahir" className={errors.tanggal_lahir ? "text-red-500" : ""}>
                                    Tanggal Lahir
                                </Label>
                            </div>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="tanggal_lahir"
                                    type="date"
                                    className={`pl-10 h-11 ${errors.tanggal_lahir ? "border-red-500 focus-visible:ring-red-500 bg-red-50/50" : ""}`}
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                />
                            </div>
                            {errors.tanggal_lahir ? (
                                <p className="text-xs text-red-500 font-medium">{errors.tanggal_lahir}</p>
                            ) : (
                                <p className="text-[10px] text-muted-foreground text-right">
                                    Pastikan tanggal sesuai Akta Kelahiran.
                                </p>
                            )}
                        </div>

                        {/* Tombol Action */}
                        <div className="space-y-4 pt-2">
                            <Button
                                type="submit"
                                className="w-full h-11 text-base shadow-lg shadow-primary/20"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memeriksa Data...
                                    </>
                                ) : (
                                    <>
                                        Masuk Portal <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setShowHelp(!showHelp)}
                                    className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
                                >
                                    {showHelp ? "Tutup Bantuan" : "Lupa NISN atau Tanggal Lahir?"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
