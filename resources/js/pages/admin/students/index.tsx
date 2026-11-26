import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { type SharedData, type Student } from '@/types';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileSpreadsheet,
    Hash,
    MoreHorizontal,
    Pencil,
    Phone,
    Plus,
    Power,
    School,
    Search,
    ShieldCheck,
    Siren,
    Trash2,
    Users,
} from 'lucide-react';

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
    stats: {
        total: number;
        safe: number;
        warning: number;
        critical: number;
    };
    kelasOptions: string[];
    filters: {
        search: string;
        kelas: string;
        status: string;
    };
}

export default function Index({
    students,
    stats,
    kelasOptions,
    filters,
}: Props) {
    const { flash, auth } = usePage<SharedData>().props;
    const isAdmin = (auth.roles ?? []).includes('admin');
    const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getPointCategory = (poin: number) => {
        if (poin >= 90) {
            return {
                label: 'Aman',
                color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
                icon: <ShieldCheck className="h-4 w-4 text-green-600" />,
            };
        } else if (poin >= 50) {
            return {
                label: 'Waspada',
                color: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
                icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
            };
        } else {
            return {
                label: 'Bahaya',
                color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
                icon: <Siren className="h-4 w-4 text-red-600" />,
            };
        }
    };

    const applyFilters = (next: Partial<typeof filters>) => {
        router.get(
            '/admin/students',
            {
                search: next.search ?? searchQuery,
                kelas: next.kelas ?? filters.kelas,
                status: next.status ?? filters.status,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchQuery });
    };

    const confirmDeactivate = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/students/${deleteTarget.id}`, {
            onFinish: () => setDeleteTarget(null),
            preserveScroll: true,
        });
    };

    const handleToggleStatus = (student: Student) => {
        router.patch(
            `/admin/students/${student.id}/toggle-status`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Data Siswa', href: '/admin/students' },
            ]}
        >
            <Head title="Manajemen Siswa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {flash?.success && (
                    <Alert className="border-green-500/50 bg-green-50 text-green-900">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* HEADER */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Data Siswa
                        </h2>
                        <p className="text-muted-foreground">
                            Monitoring poin kedisiplinan dan status keaktifan
                            siswa.
                        </p>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <a href="/admin/students/export">
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    Export CSV
                                </a>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/admin/students/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Siswa
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* STATS CARDS */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Siswa Aktif
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Terdaftar aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Siswa Aman
                            </CardTitle>
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.safe}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Poin &ge; 90
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-400">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Perlu Perhatian
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.warning}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Poin 50 - 89
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500 bg-red-50/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sangat Kritis
                            </CardTitle>
                            <Siren className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {stats.critical}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Poin &lt; 50
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* TABLE */}
                <Card className="flex flex-col">
                    <CardHeader className="border-b px-6 py-4">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                <CardTitle>Direktori Siswa</CardTitle>
                                <CardDescription>
                                    Menampilkan {students.data.length} dari{' '}
                                    {students.total} data siswa.
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Select
                                    value={filters.status || 'active'}
                                    onValueChange={(val) =>
                                        applyFilters({ status: val })
                                    }
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Aktif
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Nonaktif
                                        </SelectItem>
                                        <SelectItem value="all">
                                            Semua
                                        </SelectItem>
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
                                    onSubmit={handleSearchSubmit}
                                    className="relative w-full sm:w-64"
                                >
                                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari nama / NISN (Enter)..."
                                        className="bg-background pl-9"
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
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-[70px] pl-6">
                                        Profil
                                    </TableHead>
                                    <TableHead>Identitas Siswa</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Kelas & Rombel
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        NISN
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Status
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
                                            colSpan={7}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="h-8 w-8 text-muted-foreground/30" />
                                                <p>
                                                    Tidak ada data siswa
                                                    ditemukan.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    students.data.map((s) => {
                                        const status = getPointCategory(
                                            s.total_poin,
                                        );

                                        return (
                                            <TableRow
                                                key={s.id}
                                                className="group"
                                            >
                                                <TableCell className="py-3 pl-6">
                                                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                        <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                                            {getInitials(
                                                                s.nama_lengkap,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">
                                                            {s.nama_lengkap}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground md:hidden">
                                                            {s.kelas} {s.rombel}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-muted/50 font-medium"
                                                    >
                                                        {s.kelas} - {s.rombel}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden font-mono text-sm text-muted-foreground md:table-cell">
                                                    {s.nisn}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {s.is_active ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-emerald-200 bg-emerald-50 text-emerald-700"
                                                        >
                                                            Aktif
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-gray-200 bg-gray-100 text-gray-500"
                                                        >
                                                            Nonaktif
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        className={`w-14 justify-center ${status.color}`}
                                                        variant="outline"
                                                    >
                                                        {s.total_poin}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    Menu
                                                                </span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-[170px]"
                                                        >
                                                            <DropdownMenuLabel>
                                                                Pilihan
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setSelectedStudent(
                                                                        s,
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Detail
                                                            </DropdownMenuItem>
                                                            {isAdmin && (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        asChild
                                                                    >
                                                                        <Link
                                                                            href={`/admin/students/${s.id}/edit`}
                                                                        >
                                                                            <Pencil className="mr-2 h-4 w-4" />
                                                                            Edit
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    {s.is_active ? (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                setDeleteTarget(
                                                                                    s,
                                                                                )
                                                                            }
                                                                            className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Nonaktifkan
                                                                        </DropdownMenuItem>
                                                                    ) : (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleToggleStatus(
                                                                                    s,
                                                                                )
                                                                            }
                                                                            className="text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600"
                                                                        >
                                                                            <Power className="mr-2 h-4 w-4" />
                                                                            Aktifkan
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {/* PAGINATION */}
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

                {/* DETAIL DIALOG */}
                <Dialog
                    open={!!selectedStudent}
                    onOpenChange={(open) => !open && setSelectedStudent(null)}
                >
                    <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[425px]">
                        {selectedStudent && (
                            <>
                                {(() => {
                                    const status = getPointCategory(
                                        selectedStudent.total_poin,
                                    );
                                    return (
                                        <>
                                            <DialogHeader className="bg-muted/30 p-6 pb-4">
                                                <div className="flex flex-col items-center gap-3 text-center">
                                                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                                                        <AvatarFallback className="bg-primary/20 text-2xl font-bold text-primary">
                                                            {getInitials(
                                                                selectedStudent.nama_lengkap,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <DialogTitle className="text-xl">
                                                            {
                                                                selectedStudent.nama_lengkap
                                                            }
                                                        </DialogTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                selectedStudent.nisn
                                                            }
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${status.color}`}
                                                    >
                                                        {status.icon}
                                                        <span>
                                                            {
                                                                selectedStudent.total_poin
                                                            }{' '}
                                                            Poin ({status.label}
                                                            )
                                                        </span>
                                                    </div>
                                                </div>
                                            </DialogHeader>

                                            <div className="space-y-6 p-6">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                            <School className="h-3 w-3" />{' '}
                                                            Kelas
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {
                                                                selectedStudent.kelas
                                                            }{' '}
                                                            -{' '}
                                                            {
                                                                selectedStudent.rombel
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                            <Hash className="h-3 w-3" />{' '}
                                                            Jenis Kelamin
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {selectedStudent.jenis_kelamin ===
                                                            'L'
                                                                ? 'Laki-laki'
                                                                : 'Perempuan'}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                            <Calendar className="h-3 w-3" />{' '}
                                                            Tgl Lahir
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {formatDate(
                                                                selectedStudent.tanggal_lahir,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                            <Phone className="h-3 w-3" />{' '}
                                                            Kontak
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {selectedStudent.no_hp ||
                                                                '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            setSelectedStudent(
                                                                null,
                                                            )
                                                        }
                                                    >
                                                        Tutup
                                                    </Button>
                                                    <Button asChild>
                                                        <Link
                                                            href={`/admin/students/${selectedStudent.id}/edit`}
                                                        >
                                                            Edit Data
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* DEACTIVATE ALERT */}
                <AlertDialog
                    open={!!deleteTarget}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Nonaktifkan Siswa?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Siswa{' '}
                                <strong>{deleteTarget?.nama_lengkap}</strong>{' '}
                                akan dinonaktifkan dan tidak dapat login ke
                                Portal Siswa. Anda dapat mengaktifkannya kembali
                                kapan saja melalui filter status Nonaktif.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDeactivate}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Ya, Nonaktifkan
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
