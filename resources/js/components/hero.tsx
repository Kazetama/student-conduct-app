import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    BellRing
} from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">

            {/* Background Decoration (Lebih Soft) */}
            <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/10 rounded-full blur-[100px] opacity-40 translate-x-1/3 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 rounded-full blur-[100px] opacity-30 -translate-x-1/3 translate-y-1/4" />

            {/* Container Utama (Disamakan dengan Navbar: max-w-7xl) */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

                    {/* === BAGIAN KIRI: COPYWRITING === */}
                    <div className="flex flex-col justify-center text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* Badge */}
                        <div className="inline-flex items-center justify-center lg:justify-start">
                            <span className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
                                <span className="mr-2 flex h-2 w-2">
                                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                </span>
                                Sistem Informasi Akademik v2.0
                            </span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-4">
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl xl:text-6xl leading-tight">
                                Platform Sekolah <br className="hidden lg:block" />
                                <span className="text-primary">Digital & Terintegrasi</span>
                            </h1>
                            <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl mx-auto lg:mx-0 leading-relaxed">
                                Pantau kedisiplinan (Poin), presensi, dan perkembangan akademik siswa secara <i>real-time</i>. Transparansi untuk orang tua, kemudahan bagi guru.
                            </p>
                        </div>

                        {/* List Fitur */}
                        <div className="flex flex-col sm:flex-row gap-x-8 gap-y-3 justify-center lg:justify-start text-sm font-medium text-muted-foreground">
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span>Kredit Poin Pelanggaran</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span>Kartu Pelajar Digital</span>
                                </li>
                            </ul>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span>Notifikasi WhatsApp Wali</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span>Rekap Laporan BK Otomatis</span>
                                </li>
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                            <Link href="/student/login">
                                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform">
                                    Akses Portal Siswa
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base hover:bg-muted">
                                    Login Guru / Staff
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* === BAGIAN KANAN: MOCKUP VISUAL === */}
                    <div className="relative mx-auto w-full max-w-[500px] lg:max-w-full">

                        {/* Blob Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/30 to-blue-500/30 blur-[80px] rounded-full -z-10" />

                        {/* Dashboard Card Container */}
                        <div className="relative rounded-2xl border bg-background/60 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/20">

                            {/* Browser Header */}
                            <div className="border-b bg-muted/50 px-4 py-3 flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="ml-2 h-6 w-full max-w-[240px] bg-background/80 rounded-md border flex items-center px-3 shadow-sm">
                                    <span className="text-[10px] text-muted-foreground">siakad.sch.id</span>
                                </div>
                            </div>

                            {/* Dashboard Body Mockup */}
                            <div className="p-5 bg-gray-50/50 dark:bg-gray-900/50">
                                <div className="flex gap-5">
                                    {/* Sidebar Mini */}
                                    <div className="hidden sm:flex flex-col gap-3 w-16 flex-shrink-0">
                                        <div className="h-10 w-10 bg-white rounded-xl shadow-sm border mb-4" />
                                        <div className="h-8 w-8 bg-primary/10 rounded-lg" />
                                        <div className="h-8 w-8 bg-transparent rounded-lg" />
                                        <div className="h-8 w-8 bg-transparent rounded-lg" />
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="flex-1 space-y-4">
                                        {/* Header Row */}
                                        <div className="flex justify-between items-center">
                                            <div className="h-4 w-32 bg-gray-200 rounded-md" />
                                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                                        </div>

                                        {/* Stats Cards Row */}
                                        <div className="grid grid-cols-3 gap-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="bg-white p-3 rounded-xl border shadow-sm space-y-2">
                                                    <div className="h-8 w-8 bg-primary/10 rounded-lg" />
                                                    <div className="h-3 w-12 bg-gray-100 rounded" />
                                                    <div className="h-4 w-8 bg-gray-200 rounded" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Chart Area */}
                                        <div className="bg-white p-4 rounded-xl border shadow-sm h-32 flex items-end justify-between gap-2 px-6 pb-0">
                                            <div className="w-full bg-primary/20 rounded-t-md h-[40%]" />
                                            <div className="w-full bg-primary/40 rounded-t-md h-[70%]" />
                                            <div className="w-full bg-primary/20 rounded-t-md h-[50%]" />
                                            <div className="w-full bg-primary rounded-t-md h-[85%]" />
                                            <div className="w-full bg-primary/30 rounded-t-md h-[60%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Notification (Visual Interest) */}
                            <div className="absolute top-20 -right-4 bg-white p-3 rounded-lg border shadow-lg flex items-center gap-3 animate-bounce [animation-duration:4s]">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <ShieldCheck className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="pr-2">
                                    <p className="text-[10px] font-bold text-gray-800">Status: Aman</p>
                                    <p className="text-[9px] text-muted-foreground">Poin: 100/100</p>
                                </div>
                            </div>

                            <div className="absolute bottom-10 -left-4 bg-white p-3 rounded-lg border shadow-lg flex items-center gap-3 animate-bounce [animation-duration:5s]">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <BellRing className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="pr-2">
                                    <p className="text-[10px] font-bold text-gray-800">Laporan Baru</p>
                                    <p className="text-[9px] text-muted-foreground">Terkirim ke Wali</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
