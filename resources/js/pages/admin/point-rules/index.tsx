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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type PointRule,
    type SharedData,
} from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Aturan Poin', href: '/admin/point-rules' },
];

export default function Index({ rules }: { rules: PointRule[] }) {
    const { flash } = usePage<SharedData>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'penalty' | 'reward'>(
        'all',
    );

    const filteredRules = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return rules.filter((rule) => {
            const matchesType =
                typeFilter === 'all' || rule.type === typeFilter;
            const matchesSearch =
                q === '' ||
                rule.nama.toLowerCase().includes(q) ||
                rule.kategori.toLowerCase().includes(q);
            return matchesType && matchesSearch;
        });
    }, [rules, searchQuery, typeFilter]);

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/admin/point-rules/${deleteId}`, {
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Aturan Poin" />

            <div className="container mx-auto space-y-6 p-6">
                {flash?.success && (
                    <Alert className="border-green-500/50 bg-green-50 text-green-900">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Aturan Poin
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Kelola daftar pelanggaran (penalty) dan prestasi
                            (reward).
                        </p>
                    </div>
                    <Button asChild size="sm" className="gap-2">
                        <Link href="/admin/point-rules/create">
                            <Plus className="h-4 w-4" />
                            Tambah Aturan
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-col justify-between gap-4 space-y-0 pb-4 sm:flex-row sm:items-center">
                        <CardTitle className="text-xl">
                            Daftar Aturan ({filteredRules.length})
                        </CardTitle>
                        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                            <Select
                                value={typeFilter}
                                onValueChange={(val) =>
                                    setTypeFilter(
                                        val as 'all' | 'penalty' | 'reward',
                                    )
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
                                        Penalty
                                    </SelectItem>
                                    <SelectItem value="reward">
                                        Reward
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari aturan..."
                                    className="bg-background pl-9"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Nama Aturan</TableHead>
                                        <TableHead className="w-[110px] text-center">
                                            Jenis
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Kategori
                                        </TableHead>
                                        <TableHead className="w-[100px] text-center">
                                            Poin
                                        </TableHead>
                                        <TableHead className="w-[120px] text-center">
                                            Batas/Bulan
                                        </TableHead>
                                        <TableHead className="w-[110px] text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-[80px] text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRules.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                Tidak ada aturan poin yang
                                                sesuai.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRules.map((rule) => (
                                            <TableRow
                                                key={rule.id}
                                                className="hover:bg-muted/5"
                                            >
                                                <TableCell className="font-medium">
                                                    {rule.nama}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant={
                                                            rule.type ===
                                                            'reward'
                                                                ? 'default'
                                                                : 'destructive'
                                                        }
                                                        className={
                                                            rule.type ===
                                                            'reward'
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : ''
                                                        }
                                                    >
                                                        {rule.type === 'reward'
                                                            ? 'Reward'
                                                            : 'Penalty'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center capitalize text-muted-foreground">
                                                    {rule.kategori}
                                                </TableCell>
                                                <TableCell className="text-center font-bold">
                                                    <span
                                                        className={
                                                            rule.type ===
                                                            'reward'
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }
                                                    >
                                                        {rule.type === 'reward'
                                                            ? '+'
                                                            : '-'}
                                                        {Math.abs(rule.point)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center text-sm text-muted-foreground">
                                                    {rule.max_per_period
                                                        ? `${rule.max_per_period}x`
                                                        : 'Tak terbatas'}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {rule.is_active ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1 border-green-200 bg-green-50 text-green-700"
                                                        >
                                                            <CheckCircle2 className="h-3 w-3" />{' '}
                                                            Aktif
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1 border-gray-200 bg-gray-50 text-gray-500"
                                                        >
                                                            <XCircle className="h-3 w-3" />{' '}
                                                            Nonaktif
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <span className="sr-only">
                                                                    Open menu
                                                                </span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>
                                                                Aksi
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={`/admin/point-rules/${rule.id}/edit`}
                                                                    className="flex w-full cursor-pointer items-center"
                                                                >
                                                                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                                                                onClick={() =>
                                                                    setDeleteId(
                                                                        rule.id,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <AlertDialog
                    open={!!deleteId}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Apakah anda yakin?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Aturan poin ini akan dihapus permanen jika belum
                                pernah digunakan dalam riwayat pelanggaran
                                siswa.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Ya, Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
