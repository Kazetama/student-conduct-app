import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import {
    LineChart,
    Line,
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
    TrendingUp,
    MoreHorizontal
} from 'lucide-react'

// --- MOCK COMPONENTS (Anggap ini dari Shadcn UI components folder) ---
// Dalam project asli, import langsung dari components/ui/...
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

// Custom Tooltip agar lebih cantik saat hover chart
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-3 shadow-lg ring-1 ring-black/5">
                <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <p className="font-bold text-foreground">
                        {payload[0].value} <span className="text-xs font-normal text-muted-foreground">Points</span>
                    </p>
                </div>
            </div>
        )
    }
    return null
}

export default function Dashboard({ stats, pointsChart }: DashboardProps) {
    // Hitung persentase sederhana untuk visualisasi tambahan (opsional)
    const activeRate = Math.round((stats.active_students / stats.total_students) * 100) || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
                        <p className="text-muted-foreground">Analisis performa dan data siswa terkini.</p>
                    </div>
                </div>

                {/* === MAIN LAYOUT GRID === */}
                {/* Menggunakan grid 1 kolom di HP, dan 3 kolom di Desktop */}
                {/* Sesuai request: Grafik di Kiri (2/3), Stats di Kanan (1/3) */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">

                    {/* === LEFT: CHART SECTION (Lebih Besar) === */}
                    <Card className="col-span-1 flex flex-col justify-between lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Trend Poin Siswa</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Akumulasi poin harian dalam 30 hari terakhir.
                                    </p>
                                </div>
                                {/* Icon dekorasi */}
                                <div className="rounded-md bg-primary/10 p-2 text-primary">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pl-0">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {/* Ganti LineChart biasa dengan AreaChart agar terlihat lebih modern */}
                                    <AreaChart data={pointsChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                {/* Menggunakan CSS Variables Tailwind untuk warna */}
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="date"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorTotal)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* === RIGHT: STATS BOXES (Stacked Vertically) === */}
                    <div className="flex flex-col gap-6">

                        {/* Total Students Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.total_students}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total data terdaftar dalam sistem
                                </p>
                            </CardContent>
                        </Card>

                        {/* Active Students Card */}
                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Siswa Aktif</CardTitle>
                                <UserCheck className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">{stats.active_students}</div>
                                <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
                                    <div
                                        className="h-1.5 rounded-full bg-green-500"
                                        style={{ width: `${activeRate}%` }}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {activeRate}% dari total siswa
                                </p>
                            </CardContent>
                        </Card>

                        {/* Inactive Students Card */}
                        <Card className="border-l-4 border-l-red-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Siswa Tidak Aktif</CardTitle>
                                <UserX className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-600">{stats.inactive_students}</div>
                                <p className="text-xs text-muted-foreground">
                                    Memerlukan perhatian khusus
                                </p>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
