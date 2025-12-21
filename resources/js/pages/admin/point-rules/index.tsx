import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { type PointRule } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Input } from '@/components/ui/input';

// Icons
import { Plus, Search, MoreHorizontal, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/' },
    { title: 'Aturan Poin', href: '/admin/point-rules' },
];

export default function Index({ rules }: { rules: PointRule[] }) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

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

            <div className="container mx-auto p-6 space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Aturan Poin</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola daftar pelanggaran (penalty) dan prestasi (reward).
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
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xl">Daftar Aturan</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari aturan..."
                                className="pl-9 bg-background"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Nama Aturan</TableHead>
                                        <TableHead className="text-center w-[120px]">Jenis</TableHead>
                                        <TableHead className="text-center">Kategori</TableHead>
                                        <TableHead className="text-center w-[100px]">Poin</TableHead>
                                        <TableHead className="text-center w-[120px]">Status</TableHead>
                                        <TableHead className="text-right w-[80px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rules.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                Belum ada aturan poin yang dibuat.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        rules.map((rule) => (
                                            <TableRow key={rule.id} className="hover:bg-muted/5">
                                                <TableCell className="font-medium">
                                                    {rule.nama}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant={rule.type === 'reward' ? 'default' : 'destructive'}
                                                        className={rule.type === 'reward' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                    >
                                                        {rule.type === 'reward' ? 'Reward' : 'Penalty'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-muted-foreground">
                                                    {rule.kategori}
                                                </TableCell>
                                                <TableCell className="text-center font-bold">
                                                    <span className={rule.type === 'reward' ? 'text-green-600' : 'text-red-600'}>
                                                        {rule.type === 'reward' ? '+' : '-'}{Math.abs(rule.point)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {rule.is_active ? (
                                                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 gap-1">
                                                            <CheckCircle2 className="h-3 w-3" /> Aktif
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-gray-200 text-gray-500 bg-gray-50 gap-1">
                                                            <XCircle className="h-3 w-3" /> Nonaktif
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/point-rules/${rule.id}/edit`} className="cursor-pointer flex items-center w-full">
                                                                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                                                                onClick={() => setDeleteId(rule.id)}
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

                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Aturan poin ini akan dihapus permanen. Pastikan aturan ini tidak sedang digunakan dalam riwayat pelanggaran siswa.
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
