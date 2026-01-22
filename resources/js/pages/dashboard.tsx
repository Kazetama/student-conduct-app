import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts'
import {
    Users,
    UserCheck,
    UserX,
    Activity,
    TrendingUp,
    ShieldCheck,
    AlertCircle
} from 'lucide-react'

// --- MOCK COMPONENTS (Gunakan komponen asli Shadcn UI di project kamu) ---
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>
)
const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
)
const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
)
const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
)
// ------------------------------------------------------------------

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
]

interface ChartPoint {
    date: string
    total: number
}

interface DashboardProps {
    stats: {
        total_students: number
        active_students: number
        inactive_students: number
    }
    pointsChart: ChartPoint[]
}

// Custom Tooltip yang bersih
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-3 shadow-xl ring-1 ring-black/5">
                <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-primary shadow-sm" />
                    <p className="font-bold text-foreground text-sm">
                        {payload[0].value} <span className="font-normal text-muted-foreground">Rata-rata Poin</span>
                    </p>
                </div>
            </div>
        )
    }
    return null
}

export default function Dashboard({ stats, pointsChart }: DashboardProps) {
    // Hitung persentase keaktifan
    const activeRate = stats.total_students > 0
        ? Math.round((stats.active_students / stats.total_students) * 100)
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">

                {/* === HEADER SECTION === */}
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
                        <p className="text-muted-foreground">
                            Ringkasan performa kedisiplinan dan data akademik.
                        </p>
                    </div>
                    {/* Indikator Tanggal/Status (Opsional) */}
                    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                        <Activity className="h-3.5 w-3.5" />
                        Update Real-time
                    </div>
                </div>

                {/* === MAIN LAYOUT GRID === */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">

                    {/* === LEFT: CHART SECTION (2/3 Width) === */}
                    <Card className="col-span-1 flex flex-col justify-between shadow-sm lg:col-span-2">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-semibold">Tren Poin Kedisiplinan</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Grafik rata-rata sisa poin siswa dalam 30 hari terakhir.
                                    </p>
                                </div>
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pl-0">
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={pointsChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="date"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={12}
                                            minTickGap={30}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2.5}
                                            fillOpacity={1}
                                            fill="url(#colorTotal)"
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* === RIGHT: STATS SECTION (1/3 Width) === */}
                    <div className="flex flex-col gap-6">

                        {/* Card: Total Siswa */}
                        <Card className="shadow-sm transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Populasi</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight">{stats.total_students}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Total siswa terdaftar di database
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card: Siswa Aktif (HIJAU - AMAN) */}
                        <Card className="border-l-4 border-l-green-500 shadow-sm transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Siswa Aktif</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                    <UserCheck className="h-4 w-4 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <div className="text-3xl font-bold text-green-700">{stats.active_students}</div>
                                    <span className="text-sm font-medium text-green-600/80">({activeRate}%)</span>
                                </div>

                                {/* Progress Bar Visual */}
                                <div className="mt-3 h-1.5 w-full rounded-full bg-green-100">
                                    <div
                                        className="h-1.5 rounded-full bg-green-500 transition-all duration-1000"
                                        style={{ width: `${activeRate}%` }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Status akademik berjalan normal
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card: Siswa Tidak Aktif (MERAH - WARNING) */}
                        <Card className="border-l-4 border-l-red-500 shadow-sm transition-all hover:shadow-md bg-red-50/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tidak Aktif / Keluar</CardTitle>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                                    <UserX className="h-4 w-4 text-red-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-700">{stats.inactive_students}</div>
                                <p className="text-xs text-red-600/80 mt-1 font-medium flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Memerlukan validasi admin
                                </p>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
