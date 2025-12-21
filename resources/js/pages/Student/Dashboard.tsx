import React from 'react';
import { Head, router } from '@inertiajs/react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// PERBAIKAN DISINI: Import dari 'ui/alert', bukan 'ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Icons
import {
    LogOut,
    User,
    Calendar,
    School,
    Hash,
    ShieldAlert,
    BookOpen,
    Trophy
} from 'lucide-react';

type Student = {
    nama_lengkap: string;
    nisn: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string;
    kelas: string;
    rombel: string;
    tahun_ajaran: string;
    total_poin: number;
    is_active: boolean;
};

type Props = {
    student: Student;
};

export default function Dashboard({ student }: Props) {
    function logout() {
        router.post('/student/logout');
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const isPointSafe = student.total_poin >= 50;

    return (
        <div className="min-h-screen bg-muted/20">
            <Head title="Dashboard Siswa" />

            <nav className="bg-background border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2 font-semibold text-lg">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                        <School className="h-5 w-5" />
                    </div>
                    <span className="hidden sm:inline">Portal Siswa</span>
                </div>
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </nav>

            <main className="container mx-auto p-4 md:p-8 max-w-5xl space-y-6">

                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Halo, {student.nama_lengkap.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-muted-foreground">
                            Selamat datang di dashboard monitoring siswa.
                        </p>
                    </div>
                    <Badge variant={student.is_active ? "default" : "destructive"} className="px-3 py-1 text-sm">
                        {student.is_active ? "Status: Aktif" : "Status: Non-Aktif"}
                    </Badge>
                </div>

                {/* PERBAIKAN DISINI: Menggunakan komponen Alert Shadcn yang benar */}
                {!student.is_active && (
                    <Alert variant="destructive">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertTitle>Akun Dibekukan</AlertTitle>
                        <AlertDescription>
                            Akun anda saat ini berstatus tidak aktif. Silakan hubungi tata usaha jika ini adalah kesalahan.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* KOLOM KIRI: Profile Card */}
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Informasi Pribadi
                            </CardTitle>
                            <CardDescription>Detail data diri dan akademik siswa.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
                                <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                        {getInitials(student.nama_lengkap)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center sm:text-left space-y-1">
                                    <h2 className="text-xl font-bold">{student.nama_lengkap}</h2>
                                    <p className="text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded inline-block">
                                        NISN: {student.nisn}
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground pt-1">
                                        <School className="h-3 w-3" />
                                        <span>Kelas {student.kelas} - {student.rombel}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                                        <Hash className="h-3 w-3" /> Jenis Kelamin
                                    </label>
                                    <p className="font-medium">
                                        {student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Tanggal Lahir
                                    </label>
                                    <p className="font-medium">
                                        {formatDate(student.tanggal_lahir)}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" /> Tahun Ajaran
                                    </label>
                                    <p className="font-medium">
                                        {student.tahun_ajaran}
                                    </p>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* KOLOM KANAN: Score Card */}
                    <Card className="shadow-sm h-fit">
                        <CardHeader className="bg-muted/10 border-b">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Trophy className="h-5 w-5 text-yellow-600" />
                                Poin Kedisiplinan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8 pb-8 text-center">

                            <div className={`
                                mx-auto flex items-center justify-center
                                w-32 h-32 rounded-full border-8
                                ${isPointSafe ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}
                            `}>
                                <span className={`text-4xl font-extrabold ${isPointSafe ? 'text-green-600' : 'text-red-600'}`}>
                                    {student.total_poin}
                                </span>
                            </div>

                            <div className="mt-4 space-y-2">
                                <Badge variant={isPointSafe ? "secondary" : "destructive"} className="text-sm px-4 py-1">
                                    {isPointSafe ? "Kondisi Aman" : "Perlu Perhatian"}
                                </Badge>
                                <p className="text-sm text-muted-foreground px-4">
                                    {isPointSafe
                                        ? "Pertahankan poin anda di atas ambang batas."
                                        : "Poin anda berada di bawah batas aman. Segera hubungi BK."
                                    }
                                </p>
                            </div>

                        </CardContent>
                        <CardFooter className="bg-muted/10 border-t p-4">
                            <p className="text-xs text-center w-full text-muted-foreground">
                                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
                            </p>
                        </CardFooter>
                    </Card>

                </div>
            </main>
        </div>
    );
}
