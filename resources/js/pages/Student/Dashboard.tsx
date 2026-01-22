import React from 'react';
import { Head, router } from '@inertiajs/react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress'; // Pastikan component Progress sudah diinstall

// Icons
import {
    LogOut,
    User,
    Calendar,
    School,
    Hash,
    ShieldCheck,
    AlertTriangle,
    Siren,
    BookOpen,
    CreditCard
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

    // --- Logic Helper ---
    function logout() {
        router.post('/student/logout');
    }

    const getInitials = (name: string) => {
        return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
    };

    // Logika Warna & Status Poin
    const getPointStatus = (poin: number) => {
        if (poin >= 90) return { label: 'Sangat Baik', color: 'text-green-600', bg: 'bg-green-600', border: 'border-green-200', icon: ShieldCheck, desc: 'Pertahankan prestasi ini!' };
        if (poin >= 50) return { label: 'Perlu Perhatian', color: 'text-yellow-600', bg: 'bg-yellow-500', border: 'border-yellow-200', icon: AlertTriangle, desc: 'Hati-hati, poin mulai menurun.' };
        return { label: 'Bahaya', color: 'text-red-600', bg: 'bg-red-600', border: 'border-red-200', icon: Siren, desc: 'Segera hubungi BK/Wali Kelas.' };
    };

    const pointStatus = getPointStatus(student.total_poin);
    const StatusIcon = pointStatus.icon;

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Head title="Dashboard Siswa" />

            {/* === HEADER === */}
            <nav className="bg-white border-b px-6 py-4 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <School className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight leading-none">Portal Siswa</span>
                            <span className="text-xs text-muted-foreground">Monitoring Akademik</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50 gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Keluar</span>
                    </Button>
                </div>
            </nav>

            <main className="container mx-auto max-w-6xl p-4 md:p-8 space-y-8">

                {/* === WELCOME SECTION === */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Selamat Datang, {student.nama_lengkap.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Berikut adalah ringkasan data akademik dan kedisiplinan Anda.
                        </p>
                    </div>
                    {!student.is_active && (
                        <Badge variant="destructive" className="px-4 py-1.5 text-sm uppercase tracking-wider">
                            Status: Non-Aktif
                        </Badge>
                    )}
                </div>

                {/* === ALERT JIKA NON-AKTIF === */}
                {!student.is_active && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
                        <Siren className="h-4 w-4" />
                        <AlertTitle>Perhatian</AlertTitle>
                        <AlertDescription>
                            Status siswa Anda saat ini <b>Non-Aktif</b>. Akses ke beberapa fitur mungkin dibatasi. Silakan hubungi Tata Usaha sekolah.
                        </AlertDescription>
                    </Alert>
                )}

                {/* === MAIN GRID === */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* === KARTU 1: STATUS POIN (Hero Card) === */}
                    <Card className={`lg:col-span-1 shadow-md border-t-4 ${pointStatus.border} overflow-hidden relative`}>
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-muted/10 blur-xl" />

                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Kredit Poin Siswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className={`text-5xl font-extrabold ${pointStatus.color}`}>
                                        {student.total_poin}
                                    </span>
                                    <span className="text-sm text-muted-foreground ml-1">/ 100</span>
                                </div>
                                <div className={`p-3 rounded-full ${pointStatus.bg} bg-opacity-10`}>
                                    <StatusIcon className={`h-8 w-8 ${pointStatus.color}`} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Status Kondisi</span>
                                    <span className={pointStatus.color}>{pointStatus.label}</span>
                                </div>
                                <Progress value={student.total_poin} className="h-3" />
                                <p className="text-xs text-muted-foreground pt-1">
                                    {pointStatus.desc}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 border-t py-3">
                            <div className="flex gap-4 w-full text-xs text-muted-foreground justify-center">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>90-100 Aman</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span>50-89 Waspada</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span>&lt;50 Bahaya</span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* === KARTU 2: DIGITAL STUDENT ID (Profile) === */}
                    <Card className="lg:col-span-2 shadow-md">
                        <CardHeader className="border-b bg-muted/10">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Kartu Digital Pelajar</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

                                {/* Foto / Avatar */}
                                <div className="flex flex-col items-center gap-3">
                                    <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-3xl font-bold">
                                            {getInitials(student.nama_lengkap)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Badge variant="outline" className="mt-2 font-mono">
                                        {student.nisn}
                                    </Badge>
                                </div>

                                {/* Detail Data */}
                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                            <User className="h-3 w-3" /> Nama Lengkap
                                        </label>
                                        <p className="font-medium text-lg text-gray-900 border-b pb-1">
                                            {student.nama_lengkap}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                            <School className="h-3 w-3" /> Kelas & Rombel
                                        </label>
                                        <p className="font-medium text-lg text-gray-900 border-b pb-1">
                                            {student.kelas} - {student.rombel}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Tanggal Lahir
                                        </label>
                                        <p className="font-medium text-gray-700">
                                            {formatDate(student.tanggal_lahir)}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                            <Hash className="h-3 w-3" /> Jenis Kelamin
                                        </label>
                                        <p className="font-medium text-gray-700">
                                            {student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                        </p>
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" /> Tahun Ajaran Aktif
                                        </label>
                                        <p className="font-medium text-gray-700 bg-muted/30 px-3 py-2 rounded-md inline-block">
                                            {student.tahun_ajaran}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* === FOOTER INFO === */}
                <div className="text-center text-sm text-muted-foreground pt-8 pb-4">
                    <p>
                        Jika terdapat kesalahan data, mohon segera hubungi Operator Sekolah atau Wali Kelas.
                    </p>
                    <p className="text-xs mt-1 opacity-70">
                        &copy; {new Date().getFullYear()} Sistem Informasi Akademik Sekolah.
                    </p>
                </div>

            </main>
        </div>
    );
}
