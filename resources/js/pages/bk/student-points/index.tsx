import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type StudentPointRecord } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Gavel,
    History,
    Search,
} from 'lucide-react';
import { useState } from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    records: {
        data: StudentPointRecord[];
        current_page: number;
        last_page: number;
        total: number;
        links: PaginationLink[];
    };
    filters: {
        search: string;
        type: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard BK', href: '/bk/dashboard' },
    { title: 'Riwayat Poin', href: '/bk/student-points' },
];

export default function Index({ records, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');

    const applyFilters = (next: Partial<typeof filters>) => {
        router.get(
            '/bk/student-points',
            {
                search: next.search ?? searchQuery,
                type: next.type ?? filters.type,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchQuery });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Poin Siswa - Staf BK" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Riwayat Poin Kedisiplinan
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Log lengkap pelanggaran dan prestasi yang dicatat
                            oleh Staf BK.
                        </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/bk/student-points/create">
                            <Gavel className="mr-2 h-4 w-4" />
                            Input Poin Baru
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-col justify-between gap-4 border-b sm:flex-row sm:items-center">
                        <div>
                            <CardTitle className="text-lg">
                                Log Aktivitas ({records.total})
                            </CardTitle>
                            <CardDescription>
                                Diurutkan dari kejadian terbaru.
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={filters.type || 'all'}
                                onValueChange={(val) =>
                                    applyFilters({ type: val })
                                }
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Semua Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Jenis
                                    </SelectItem>
                                    <SelectItem value="penalty">
                                        Pelanggaran
                                    </SelectItem>
                                    <SelectItem value="reward">
                                        Prestasi
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <form
                                onSubmit={handleSearch}
                                className="relative w-full sm:w-64"
                            >
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari siswa / aturan..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value === '') {
                                            applyFilters({ search: '' });
                                        }
                                    }}
                                />
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="pl-6">
                                        Tanggal
                                    </TableHead>
                                    <TableHead>Siswa</TableHead>
                                    <TableHead>Aturan / Kejadian</TableHead>
                                    <TableHead>Keterangan</TableHead>
                                    <TableHead className="pr-6 text-right">
                                        Poin
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <History className="h-8 w-8 text-muted-foreground/30" />
                                                <p>
                                                    Belum ada riwayat poin
                                                    tercatat.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    records.data.map((item) => {
                                        const isPenalty = item.point < 0;
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="pl-6 text-sm whitespace-nowrap text-muted-foreground">
                                                    {item.tanggal}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {item.student
                                                                ?.nama_lengkap ??
                                                                '-'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {item.student?.kelas}{' '}
                                                            {
                                                                item.student
                                                                    ?.rombel
                                                            }{' '}
                                                            &bull;{' '}
                                                            {item.student?.nisn}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">
                                                            {item.point_rule
                                                                ?.nama ?? '-'}
                                                        </span>
                                                        <span className="text-xs capitalize text-muted-foreground">
                                                            {
                                                                item.point_rule
                                                                    ?.kategori
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                                    {item.keterangan || '-'}
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            isPenalty
                                                                ? 'border-red-200 bg-red-50 text-red-700'
                                                                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        }
                                                    >
                                                        {item.point > 0
                                                            ? '+'
                                                            : ''}
                                                        {item.point}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {records.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-6 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Halaman {records.current_page} dari{' '}
                                    {records.last_page}
                                </p>
                                <div className="flex items-center gap-1">
                                    {records.links.map((link, idx) => {
                                        const isPrev = idx === 0;
                                        const isNext =
                                            idx === records.links.length - 1;
                                        return (
                                            <Button
                                                key={idx}
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() =>
                                                    link.url &&
                                                    router.visit(link.url, {
                                                        preserveState: true,
                                                    })
                                                }
                                                className="h-8 px-2.5 text-xs"
                                            >
                                                {isPrev ? (
                                                    <ChevronLeft className="h-3.5 w-3.5" />
                                                ) : isNext ? (
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                ) : (
                                                    link.label
                                                )}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
