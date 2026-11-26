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
import { type BreadcrumbItem, type Student } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Gavel,
    Search,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    students: {
        data: Student[];
        current_page: number;
        last_page: number;
        total: number;
        links: PaginationLink[];
    };
    kelasOptions: string[];
    filters: {
        search: string;
        kelas: string;
        sp_level: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard BK', href: '/bk/dashboard' },
    { title: 'Monitoring Siswa', href: '/bk/students' },
];

export default function Index({ students, kelasOptions, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');

    const applyFilters = (next: Partial<typeof filters>) => {
        router.get(
            '/bk/students',
            {
                search: next.search ?? searchQuery,
                kelas: next.kelas ?? filters.kelas,
                sp_level: next.sp_level ?? filters.sp_level,
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
            <Head title="Monitoring Siswa - Staf BK" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Monitoring Kedisiplinan Siswa
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Pantau sisa poin dan status SP siswa aktif (diurutkan
                            dari poin terendah).
                        </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/bk/student-points/create">
                            <Gavel className="mr-2 h-4 w-4" />
                            Input Poin Siswa
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-col justify-between gap-4 border-b lg:flex-row lg:items-center">
                        <div>
                            <CardTitle className="text-lg">
                                Daftar Siswa Aktif ({students.total})
                            </CardTitle>
                            <CardDescription>
                                Klik &quot;Beri Poin&quot; untuk langsung
                                mencatat pelanggaran atau prestasi siswa.
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={filters.sp_level || 'all'}
                                onValueChange={(val) =>
                                    applyFilters({ sp_level: val })
                                }
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Semua SP" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="0">Aman (SP 0)</SelectItem>
                                    <SelectItem value="1">SP 1</SelectItem>
                                    <SelectItem value="2">SP 2</SelectItem>
                                    <SelectItem value="3">SP 3</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.kelas || 'all'}
                                onValueChange={(val) =>
                                    applyFilters({
                                        kelas: val === 'all' ? '' : val,
                                    })
                                }
                            >
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Semua Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Kelas
                                    </SelectItem>
                                    {kelasOptions.map((k) => (
                                        <SelectItem key={k} value={k}>
                                            Kelas {k}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <form
                                onSubmit={handleSearch}
                                className="relative w-full sm:w-64"
                            >
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama / NISN..."
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
                                        Nama Siswa
                                    </TableHead>
                                    <TableHead>NISN</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead className="text-center">
                                        Status SP
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Sisa Poin
                                    </TableHead>
                                    <TableHead className="pr-6 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="h-8 w-8 text-muted-foreground/30" />
                                                <p>
                                                    Tidak ada siswa ditemukan.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    students.data.map((s) => (
                                        <TableRow key={s.id}>
                                            <TableCell className="pl-6 font-medium">
                                                {s.nama_lengkap}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm text-muted-foreground">
                                                {s.nisn}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {s.kelas} - {s.rombel}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {s.sp_level && s.sp_level > 0 ? (
                                                    <Badge variant="destructive">
                                                        SP {s.sp_level}
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    >
                                                        Aman
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-bold">
                                                <span
                                                    className={
                                                        s.total_poin >= 90
                                                            ? 'text-emerald-600'
                                                            : s.total_poin >= 50
                                                              ? 'text-amber-600'
                                                              : 'text-red-600'
                                                    }
                                                >
                                                    {s.total_poin}
                                                </span>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/bk/student-points/create?student_id=${s.id}`}
                                                    >
                                                        <Gavel className="mr-1.5 h-3.5 w-3.5" />
                                                        Beri Poin
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {students.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-6 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Halaman {students.current_page} dari{' '}
                                    {students.last_page}
                                </p>
                                <div className="flex items-center gap-1">
                                    {students.links.map((link, idx) => {
                                        const isPrev = idx === 0;
                                        const isNext =
                                            idx === students.links.length - 1;
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
