import { Head } from '@inertiajs/react';
import Navbar from '@/components/organisms/navbar';
import Hero from '@/components/organisms/hero';

export default function Welcome() {
    return (
        <>
            <Head title="Sistem Informasi Akademik" />
            <div className="relative min-h-screen flex flex-col bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/20 selection:text-primary">
                <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-zinc-950" />
                <Navbar />
                <main className="flex-1 flex flex-col">
                    <Hero />
                </main>
            </div>
        </>
    );
}
