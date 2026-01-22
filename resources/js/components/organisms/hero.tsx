import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    BarChart3,
    ShieldCheck,
    Zap,
    Users
} from 'lucide-react';

export default function HeroModern() {
    return (
        <section className="relative w-full overflow-hidden bg-background pt-16 pb-32 lg:pt-24 lg:pb-1">
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="max-w-2xl flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="inline-flex items-center w-fit rounded-md border border-indigo-200/50 bg-indigo-50/50 dark:bg-indigo-950/30 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-300 backdrop-blur-sm">
                                <Sparkles className="mr-2 h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
                                <span>Sistem Monitoring Perilaku Siswa</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                                Pantau Perilaku Siswa <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
                                    Secara Terstruktur & Transparan
                                </span>
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                                Sistem informasi sekolah untuk mencatat, memantau, dan mengevaluasi perilaku siswa berdasarkan aturan dan poin yang ditetapkan sekolah.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link href="/student/login">
                                    <Button size="lg" className="h-12 px-8 text-base rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                                        Masuk Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/demo">
                                    <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-lg border-2 hover:bg-muted/50 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                                        Lihat Alur Sistem
                                    </Button>
                                </Link>
                            </div>

                            <div className="pt-8 flex flex-wrap items-center gap-6 border-t border-dashed mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-500" />
                                    <span className="font-semibold text-foreground">5,000+</span> Siswa
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                    <span className="font-semibold text-foreground">99.9%</span> Data Tersimpan Aman
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-amber-500" />
                                    <span className="font-semibold text-foreground">Real-time</span> Data
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative lg:h-[600px] w-full flex items-center justify-center lg:justify-end perspective-[2000px]"
                    >
                        <div
                            className="relative w-full max-w-[550px] aspect-[4/3] transition-transform duration-700 ease-out hover:[transform:rotateY(-5deg)_rotateX(5deg)_scale(1.02)] [transform:rotateY(-12deg)_rotateX(6deg)] preserve-3d"
                        >
                            <div className="absolute inset-0 bg-background border border-border/60 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-indigo-900/20 overflow-hidden ring-1 ring-white/10">
                                <div className="h-10 border-b bg-muted/30 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                                    </div>
                                    <div className="ml-4 h-5 w-full max-w-[200px] bg-muted/50 rounded-md" />
                                </div>
                                <div className="p-6 grid gap-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="h-4 w-24 bg-muted rounded-sm mb-2" />
                                            <div className="h-8 w-48 bg-foreground/10 rounded-md" />
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-2 h-32 mt-2">
                                        {[40, 70, 45, 90, 60, 80, 55].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                className="flex-1 bg-gradient-to-t from-indigo-500/20 to-indigo-500 rounded-t-sm opacity-80"
                                            />
                                        ))}
                                    </div>
                                    <div className="space-y-3 mt-2">
                                        {[1, 2].map((item) => (
                                            <div key={item} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/10">
                                                <div className="h-8 w-8 rounded-full bg-muted/50" />
                                                <div className="space-y-1">
                                                    <div className="h-3 w-24 bg-muted/60 rounded" />
                                                    <div className="h-2 w-16 bg-muted/40 rounded" />
                                                </div>
                                                <div className="ml-auto h-4 w-12 bg-green-100 dark:bg-green-900/30 rounded text-[10px] text-green-600 flex items-center justify-center font-medium">
                                                    Hadir
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -right-8 top-12 w-48 p-4 bg-background/95 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 rounded-xl shadow-xl [transform:translateZ(40px)]"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-semibold text-foreground">Monitoring Pelanggaran</span>
                                </div>
                                <div className="text-1xl font-bold text-foreground">12 Kasus Tercatat</div>
                                <div className="text-[10px] text-muted-foreground">Hari ini, 07:00 WIB</div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="absolute -left-8 bottom-20 w-52 p-4 bg-background/95 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 rounded-xl shadow-xl [transform:translateZ(60px)]"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-foreground mb-1">Status Pembinaan</div>
                                        <div className="text-xs text-muted-foreground">Ditangani Wali Kelas</div>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                        <ShieldCheck className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
