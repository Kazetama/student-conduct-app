import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

// Icons
import {
    School,
    Menu,
    ChevronRight,
    LayoutDashboard,
    Users,
    GraduationCap
} from 'lucide-react';

export default function Navbar() {
    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Beranda', href: '/' },
        // { name: 'Fitur', href: '#features' },
    ];

    return (
        // PERBAIKAN UTAMA ADA DI SINI (className header):
        // 1. w-[95%]: Memaksa lebar 95% dari layar (agar ada jarak kiri kanan di HP).
        // 2. md:w-full: Di layar tablet/desktop, gunakan lebar penuh (tapi dibatasi max-w).
        // 3. md:max-w-7xl: Batas maksimal lebar agar tidak terlalu panjang di monitor besar.
        // 4. mx-auto: Memastikan posisi selalu di tengah.
        <header className="sticky top-4 z-50 w-[95%] md:w-full md:max-w-7xl mx-auto rounded-2xl border bg-background/80 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/60">

            <div className="flex h-16 items-center justify-between px-4 sm:px-6">

                {/* === LEFT: LOGO === */}
                <div className="flex lg:flex-1">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                            <School className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col leading-none justify-center">
                            <span className="text-lg font-bold tracking-tight text-foreground">
                                SIAKAD
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
                                Digital System
                            </span>
                        </div>
                    </Link>
                </div>

                {/* === CENTER: LINKS (Desktop) === */}
                <nav className="hidden lg:flex lg:gap-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium leading-6 text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* === RIGHT: AUTH BUTTONS (Desktop) === */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
                    {auth.user ? (
                        <Link href="/dashboard">
                            <Button size="sm" className="font-semibold shadow-sm rounded-lg">
                                Dashboard Admin
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/student/login">
                                <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
                                    Portal Siswa
                                </Button>
                            </Link>

                            {/* Garis Pembatas Kecil */}
                            <div className="h-5 w-px bg-border" aria-hidden="true" />

                            <Link href="/login">
                                <Button size="sm" className="font-semibold shadow-sm rounded-lg px-6">
                                    Login Staff
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* === MOBILE MENU TRIGGER === */}
                <div className="flex lg:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-mr-2 text-muted-foreground">
                                <span className="sr-only">Open menu</span>
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] px-6 py-6">
                            <SheetHeader className="flex items-start justify-between pb-6 border-b mb-6">
                                <SheetTitle>
                                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                        <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                                            <School className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-bold text-lg leading-none">SIAKAD</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Digital System</span>
                                        </div>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-6">
                                <nav className="flex flex-col space-y-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </Link>
                                    ))}
                                </nav>

                                <div className="mt-auto grid gap-3">
                                    {auth.user ? (
                                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full justify-center rounded-xl" size="lg">
                                                Dashboard Admin
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <div className="space-y-3">
                                                <p className="text-xs font-medium text-muted-foreground uppercase pl-1">Akses Pengguna</p>
                                                <Link href="/student/login" onClick={() => setIsOpen(false)} className="block">
                                                    <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl border-dashed border-2">
                                                        <GraduationCap className="h-5 w-5 text-primary" />
                                                        Masuk Portal Siswa
                                                    </Button>
                                                </Link>
                                                <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                                                    <Button variant="default" className="w-full justify-start gap-3 h-12 rounded-xl">
                                                        <Users className="h-5 w-5" />
                                                        Login Guru & Staff
                                                    </Button>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    );
}
