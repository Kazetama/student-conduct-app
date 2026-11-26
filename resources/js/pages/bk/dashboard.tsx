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
import { type BreadcrumbItem, type StudentPointRecord } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    Award,
    Gavel,
    History,
    ShieldCheck,
    Siren,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard BK',
        href: '/bk/dashboard',
    },
];

interface ChartPoint {
    date: string;
    violations: number;
    rewards: number;
    total_events: number;
}

interface BkDashboardStats {
    active_students: number;
    safe_students: number;
    warning_students: number;
    critical_students: number;
    average_points: number;
}

interface Props {
    stats: BkDashboardStats;
    pointsChart: ChartPoint[];
    recentActivities: StudentPointRecord[];
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value?: number;
        dataKey?: string;
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const violations =
        payload.find((p) => p.dataKey === 'violations')?.value ?? 0;
    const rewards = payload.find((p) => p.dataKey === 'rewards')?.value ?? 0;

    return (
        <div className="rounded-lg border bg-background p-3 shadow-xl ring-1 ring-black/5">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
                {label}
            </p>
            <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-red-600">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Pelanggaran
                    </span>
                    <span className="font-bold">-{violations} poin</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-emerald-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Prestasi
                    </span>
                    <span className="font-bold">+{rewards} poin</span>
                </div>
            </div>
        </div>
    );
};

export default function BkDashboard({
    stats,
    pointsChart,
    recentActivities,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Staf BK" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight">
                                Panel Bimbingan & Konseling
                            </h2>
                            <Badge variant="secondary" className="text-xs">
                                Staf BK
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Monitoring kedisiplinan, pembinaan SP, dan pencatatan
                            poin siswa.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            <Activity className="h-3.5 w-3.5 text-emerald-500" />
                            Real-time
                        </div>
                        <Button asChild size="sm">
                            <Link href="/bk/student-points/create">
                                <Gavel className="mr-2 h-4 w-4" />
                                Input Poin Siswa
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Siswa Dipantau
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.active_students}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Siswa aktif dalam pembinaan
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rata-rata Poin
                            </CardTitle>
                            <Award className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                {stats.average_points}
                                <span className="ml-1 text-xs font-normal text-muted-foreground">
                                    / 100
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats.safe_students} siswa kondisi aman (&ge;90)
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Perlu Perhatian
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {stats.warning_students}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Rentang poin 50 – 89
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kondisi Kritis
                            </CardTitle>
                            <Siren className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {stats.critical_students}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Poin &lt; 50 (SP 2 / SP 3)
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* CHART + RECENT ACTIVITIES */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">
                                        Aktivitas Poin (30 Hari Terakhir)
                                    </CardTitle>
                                    <CardDescription>
                                        Perbandingan poin pelanggaran dan
                                        prestasi harian
                                    </CardDescription>
                                </div>
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                {pointsChart.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground">
                                        <ShieldCheck className="mb-2 h-8 w-8 text-muted-foreground/40" />
                                        Belum ada catatan poin dalam 30 hari
                                        terakhir.
                                    </div>
                                ) : (
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={pointsChart}>
                                            <defs>
                                                <linearGradient
                                                    id="bkViolations"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#ef4444"
                                                        stopOpacity={0.25}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#ef4444"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="bkRewards"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#10b981"
                                                        stopOpacity={0.25}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#10b981"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>

                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                fontSize={12}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                fontSize={12}
                                            />
                                            <CartesianGrid
                                                vertical={false}
                                                strokeDasharray="3 3"
                                            />
                                            <Tooltip
                                                content={<CustomTooltip />}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="violations"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                                fill="url(#bkViolations)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="rewards"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                fill="url(#bkRewards)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    Aktivitas Terbaru
                                </CardTitle>
                                <CardDescription>
                                    6 catatan poin terakhir
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/bk/student-points">
                                    <History className="mr-1.5 h-3.5 w-3.5" />
                                    Semua
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentActivities.length === 0 ? (
                                <p className="py-10 text-center text-sm text-muted-foreground">
                                    Belum ada aktivitas tercatat.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {recentActivities.map((item) => {
                                        const isPenalty = item.point < 0;
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-start justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
                                            >
                                                <div className="flex items-start gap-2.5">
                                                    <div
                                                        className={`mt-0.5 rounded-full p-1.5 ${
                                                            isPenalty
                                                                ? 'bg-red-100 text-red-600 dark:bg-red-950'
                                                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950'
                                                        }`}
                                                    >
                                                        {isPenalty ? (
                                                            <ArrowDownRight className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium">
                                                            {item.student
                                                                ?.nama_lengkap ??
                                                                'Siswa'}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {item.point_rule
                                                                ?.nama ?? '-'}
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground/80">
                                                            {item.tanggal}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        isPenalty
                                                            ? 'border-red-200 bg-red-50 text-red-700'
                                                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    }
                                                >
                                                    {item.point > 0 ? '+' : ''}
                                                    {item.point}
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
