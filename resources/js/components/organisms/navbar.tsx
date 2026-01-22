import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';

// Icons
import {
    School,
    Menu,
    ChevronRight,
    LayoutDashboard,
    Users,
    GraduationCap,
    LogIn,
    Sparkles,
    Home,
    Layers,
    LifeBuoy,
    LogOut
} from 'lucide-react';

export default function Navbar() {
    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Efek shadow & resize saat discroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Beranda', href: '/' },
    ];

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'pt-4' : 'pt-6'}`}>
            <header
                className={`
                    w-[95%] md:w-full md:max-w-7xl mx-auto
                    rounded-2xl border border-white/20 dark:border-white/10
                    bg-white/70 dark:bg-black/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60
                    transition-all duration-300
                    ${scrolled ? 'shadow-lg shadow-indigo-500/5 py-1' : 'shadow-sm py-2'}
                `}
            >
                <div className="flex h-14 items-center justify-between px-4 sm:px-6">
                    <div className="flex lg:flex-1">
                        <Link href="/" className="flex items-center gap-3 group">
                            {/* Logo Icon */}
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md transition-transform group-hover:scale-105">
                                <School className="h-5 w-5" />
                            </div>
                            {/* Logo Text */}
                            <div className="flex flex-col justify-center">
                                <span className="text-lg font-bold tracking-tight text-foreground leading-none group-hover:text-indigo-600 transition-colors">
                                    SIAKAD
                                </span>
                                <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase flex items-center gap-1">
                                    Sistem Informasi Akademik
                                </span>
                            </div>
                        </Link>
                    </div>

                    <nav className="hidden lg:flex lg:gap-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 rounded-full"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3 items-center">
                        {auth.user ? (
                            <Link href="/dashboard">
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-lg font-medium">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/student/login">
                                    <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                        Portal Siswa
                                    </Button>
                                </Link>

                                <div className="h-4 w-px bg-border/60" aria-hidden="true" />

                                <Link href="/login">
                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-lg px-5 font-medium transition-all hover:-translate-y-0.5">
                                        Login Staff
                                        <LogIn className="ml-2 h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex lg:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0 border-l border-border/40">

                                <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl">

                                    <div className="p-6 border-b border-dashed flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                                <School className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold leading-none tracking-tight">SIAKAD</h2>
                                                <p className="text-[10px] text-muted-foreground font-medium mt-1">Sistem Informasi Akademik</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto py-6 px-4">
                                        <div className="mb-8">
                                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Menu Utama</h3>
                                            <div className="space-y-1">
                                                <Link
                                                    href="/"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-3 rounded-lg bg-indigo-50/50 text-indigo-700 font-medium transition-colors border border-indigo-100/50"
                                                >
                                                    <Home className="h-4 w-4" />
                                                    Beranda
                                                </Link>
                                                <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <Layers className="h-4 w-4" />
                                                        <span>Fitur Sekolah</span>
                                                    </div>
                                                    <ChevronRight className="h-3 w-3 opacity-50 group-hover:translate-x-1 transition-transform" />
                                                </button>

                                                <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <LifeBuoy className="h-4 w-4" />
                                                        <span>Bantuan & Support</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-muted/30 border-t">
                                        {auth.user ? (
                                            <div className="bg-background border rounded-xl p-3 shadow-sm">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                        {auth.user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold truncate">{auth.user.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{auth.user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                                        <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs h-9">
                                                            Dashboard
                                                        </Button>
                                                    </Link>
                                                    <Link href="/logout" method="post" as="button" onClick={() => setIsOpen(false)}>
                                                        <Button size="sm" variant="outline" className="w-full text-xs h-9 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                                                            <LogOut className="mr-2 h-3 w-3" />
                                                            Keluar
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase text-center">Akses Sistem</p>
                                                <div className="grid gap-2">
                                                    <Link href="/student/login" onClick={() => setIsOpen(false)}>
                                                        <Button variant="outline" className="w-full h-11 justify-start relative overflow-hidden group border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700">
                                                            <div className="absolute inset-0 bg-indigo-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                                            <GraduationCap className="mr-3 h-4 w-4 relative z-10" />
                                                            <span className="relative z-10 font-medium">Masuk Portal Siswa</span>
                                                        </Button>
                                                    </Link>
                                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                                        <Button className="w-full h-11 justify-start bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20">
                                                            <Users className="mr-3 h-4 w-4" />
                                                            <span className="font-medium">Login Guru / Staff</span>
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                </div>
            </header>
        </div>
    );
}
