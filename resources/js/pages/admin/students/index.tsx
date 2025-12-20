import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { type Student } from '@/types';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
// Import Dialog Components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// Icons
import { MoreHorizontal, Plus, Search, Pencil, Trash2, Eye, Calendar, Phone, Hash, School } from 'lucide-react';

interface Props {
    students: {
        data: Student[];
    };
}

export default function Index({ students }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/students/${deleteId}`, {
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/' },
                { title: 'Students', href: '/admin/students' },
            ]}
        >
            <Head title="Students" />

            <div className="container mx-auto p-6 space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Data Siswa</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola data siswa, poin pelanggaran, dan informasi akademik.
                        </p>
                    </div>
                    <Button asChild size="sm" className="gap-2">
                        <Link href="/admin/students/create">
                            <Plus className="h-4 w-4" />
                            Tambah Siswa
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xl">Daftar Siswa</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari nama atau NISN..."
                                className="pl-9 bg-background"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[80px]">Avatar</TableHead>
                                        <TableHead>Nama Lengkap</TableHead>
                                        <TableHead className="text-center">Kelas</TableHead>
                                        <TableHead className="text-center">NISN</TableHead>
                                        <TableHead className="text-center">Poin</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                Tidak ada data siswa ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        students.data.map((s) => (
                                            <TableRow key={s.id} className="hover:bg-muted/5">
                                                <TableCell>
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                            {getInitials(s.nama_lengkap)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>{s.nama_lengkap}</span>
                                                        <span className="md:hidden text-xs text-muted-foreground">
                                                            {s.nisn}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="font-normal">
                                                        {s.kelas} {s.rombel}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-muted-foreground font-mono text-sm">
                                                    {s.nisn}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant={s.total_poin > 50 ? "destructive" : "secondary"}
                                                        className="w-10 justify-center"
                                                    >
                                                        {s.total_poin}
                                                    </Badge>
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

                                                            {/* TOMBOL LIHAT DETAIL */}
                                                            <DropdownMenuItem
                                                                onClick={() => setSelectedStudent(s)}
                                                                className="cursor-pointer"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                Lihat Detail
                                                            </DropdownMenuItem>

                                                            <DropdownMenuSeparator />

                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/students/${s.id}/edit`} className="cursor-pointer flex items-center w-full">
                                                                    <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                                                                    Edit Data
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuSeparator />

                                                            <DropdownMenuItem
                                                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                                                                onClick={() => setDeleteId(s.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Nonaktifkan
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

                <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Detail Siswa</DialogTitle>
                            <DialogDescription>
                                Informasi lengkap data siswa.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedStudent && (
                            <div className="grid gap-6 py-2">
                                {/* Header Profile */}
                                <div className="flex flex-col items-center justify-center gap-2 mb-2">
                                    <Avatar className="h-20 w-20">
                                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                            {getInitials(selectedStudent.nama_lengkap)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold">{selectedStudent.nama_lengkap}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedStudent.nisn}</p>
                                    </div>
                                    <Badge
                                        variant={selectedStudent.total_poin > 50 ? "destructive" : "secondary"}
                                        className="mt-1"
                                    >
                                        Total Poin: {selectedStudent.total_poin}
                                    </Badge>
                                </div>

                                <Separator />

                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <School className="h-4 w-4" /> Kelas
                                            </div>
                                            <p className="font-medium text-sm">
                                                {selectedStudent.kelas} - {selectedStudent.rombel}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Hash className="h-4 w-4" /> Jenis Kelamin
                                            </div>
                                            <p className="font-medium text-sm">
                                                {selectedStudent.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" /> Tanggal Lahir
                                            </div>
                                            <p className="font-medium text-sm">
                                                {formatDate(selectedStudent.tanggal_lahir)}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="h-4 w-4" /> No. HP
                                            </div>
                                            <p className="font-medium text-sm">
                                                {selectedStudent.no_hp || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <span className="text-sm text-muted-foreground">Tahun Ajaran</span>
                                        <p className="font-medium text-sm">{selectedStudent.tahun_ajaran}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini akan menonaktifkan siswa dari sistem.
                                Data mungkin tidak dapat dipulihkan dengan mudah.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
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
