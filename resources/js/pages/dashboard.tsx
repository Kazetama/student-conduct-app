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
    type TooltipContentProps ,
} from 'recharts'
import {
    Users,
    UserCheck,
    UserX,
    Activity,
    TrendingUp,
    AlertCircle,
} from 'lucide-react'
import type { ReactNode } from 'react'

// -----------------------------------------------------------------------------
// MOCK COMPONENTS (Ganti dengan Shadcn UI asli di project)
// -----------------------------------------------------------------------------
interface BaseCardProps {
    className?: string
    children: ReactNode
}

const Card = ({ className, children }: BaseCardProps) => (
    <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className ?? ''}`}>
        {children}
    </div>
)

const CardHeader = ({ className, children }: BaseCardProps) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className ?? ''}`}>
        {children}
    </div>
)

const CardTitle = ({ className, children }: BaseCardProps) => (
    <h3 className={`font-semibold leading-none tracking-tight ${className ?? ''}`}>
        {children}
    </h3>
)

const CardContent = ({ className, children }: BaseCardProps) => (
    <div className={`p-6 pt-0 ${className ?? ''}`}>
        {children}
    </div>
)
// -----------------------------------------------------------------------------

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
]

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
interface ChartPoint {
    date: string
    total: number
}

interface DashboardStats {
    total_students: number
    active_students: number
    inactive_students: number
}

interface DashboardProps {
    stats: DashboardStats
    pointsChart: ChartPoint[]
}

// -----------------------------------------------------------------------------
// CUSTOM TOOLTIP (STRICT TYPING - NO `any`)
// -----------------------------------------------------------------------------
const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipContentProps <number, string>) => {
    if (!active || !payload || payload.length === 0) {
        return null
    }

    return (
        <div className="rounded-lg border bg-background p-3 shadow-xl ring-1 ring-black/5">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
                {label}
            </p>
            <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary shadow-sm" />
                <p className="text-sm font-bold text-foreground">
                    {payload[0].value}{' '}
                    <span className="font-normal text-muted-foreground">
                        Rata-rata Poin
                    </span>
                </p>
            </div>
        </div>
    )
}

// -----------------------------------------------------------------------------
// PAGE
// -----------------------------------------------------------------------------
export default function Dashboard({ stats, pointsChart }: DashboardProps) {
    const activeRate =
        stats.total_students > 0
            ? Math.round(
                  (stats.active_students / stats.total_students) * 100,
              )
            : 0

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {/* HEADER */}
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Overview
                        </h2>
                        <p className="text-muted-foreground">
                            Ringkasan performa kedisiplinan dan data akademik.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                        <Activity className="h-3.5 w-3.5" />
                        Update Real-time
                    </div>
                </div>

                {/* GRID */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* CHART */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">
                                        Tren Poin Kedisiplinan
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Rata-rata sisa poin siswa 30 hari terakhir
                                    </p>
                                </div>
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pl-0">
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={pointsChart}>
                                        <defs>
                                            <linearGradient
                                                id="colorTotal"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="hsl(var(--primary))"
                                                    stopOpacity={0.2}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="hsl(var(--primary))"
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
                                        <Tooltip content={<CustomTooltip active={false} payload={[]} coordinate={undefined} accessibilityLayer={false} activeIndex={undefined} />} />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2.5}
                                            fill="url(#colorTotal)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* STATS */}
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm">
                                    Total Populasi
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.total_students}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm">
                                    Siswa Aktif
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-green-700">
                                        {stats.active_students}
                                    </span>
                                    <span className="text-sm text-green-600">
                                        ({activeRate}%)
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-red-500 bg-red-50/20">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm">
                                    Tidak Aktif
                                </CardTitle>
                                <UserX className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-700">
                                    {stats.inactive_students}
                                </div>
                                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                                    <AlertCircle className="h-3 w-3" />
                                    Perlu validasi admin
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
