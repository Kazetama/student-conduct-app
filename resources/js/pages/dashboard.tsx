import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ClipboardList,
    Shield,
    UserCheck,
    UserPlus,
    Users,
    UserX,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin',
        href: dashboard().url,
    },
];

interface AdminDashboardStats {
    total_users: number;
    admin_count: number;
    bk_count: number;
    siswa_user_count: number;
    total_students: number;
    active_students: number;
    inactive_students: number;
    active_rules: number;
    total_rules: number;
}

export default function Dashboard({ stats }: { stats: AdminDashboardStats }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Administrator" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {/* HEADER */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight">
                                Panel Administrator Sistem
                            </h2>
                            <Badge variant="secondary" className="text-xs">
                                Admin
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Kelola pengguna, role akses, data induk siswa, dan
                            master aturan poin.
                        </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/admin/users">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Kelola User & Role
                        </Link>
                    </Button>
                </div>

                {/* SYSTEM STATS */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-indigo-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Akun Sistem
                            </CardTitle>
                            <Shield className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_users}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats.admin_count} Admin &bull;{' '}
                                {stats.bk_count} Staf BK &bull;{' '}
                                {stats.siswa_user_count} Siswa
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Siswa Aktif
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                {stats.active_students}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Dari {stats.total_students} total siswa
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Siswa Nonaktif
                            </CardTitle>
                            <UserX className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {stats.inactive_students}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Akses portal siswa dinonaktifkan
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Master Aturan Poin
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.active_rules}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Aktif dari {stats.total_rules} total aturan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* QUICK MANAGEMENT CARDS */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="flex flex-col justify-between">
                        <CardHeader>
                            <div className="mb-2 w-fit rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                                <Shield className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base">
                                Manajemen User & Role
                            </CardTitle>
                            <CardDescription>
                                Tambah akun Staf BK, Admin, atau Siswa dan atur
                                hak akses menggunakan Spatie Role.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full justify-between"
                                asChild
                            >
                                <Link href="/admin/users">
                                    Buka Manajemen User
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between">
                        <CardHeader>
                            <div className="mb-2 w-fit rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
                                <Users className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base">
                                Data Induk Siswa
                            </CardTitle>
                            <CardDescription>
                                Tambah, edit, nonaktifkan siswa, atau export
                                data seluruh siswa ke CSV.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full justify-between"
                                asChild
                            >
                                <Link href="/admin/students">
                                    Buka Data Siswa
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between">
                        <CardHeader>
                            <div className="mb-2 w-fit rounded-lg bg-amber-50 p-2.5 text-amber-600">
                                <ClipboardList className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base">
                                Master Aturan Poin
                            </CardTitle>
                            <CardDescription>
                                Konfigurasi jenis pelanggaran, prestasi, bobot
                                poin, dan batas bulanan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full justify-between"
                                asChild
                            >
                                <Link href="/admin/point-rules">
                                    Buka Aturan Poin
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
