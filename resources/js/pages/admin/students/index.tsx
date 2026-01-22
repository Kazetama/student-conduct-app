import { useState, useMemo } from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// Icons
import {
    MoreHorizontal,
    Plus,
    Search,
    Pencil,
    Trash2,
    Eye,
    Calendar,
    Phone,
    Hash,
    School,
    Users,
    ShieldCheck,     // Icon untuk Aman
    AlertTriangle,   // Icon untuk Waspada
    Siren,           // Icon untuk Bahaya
    FileSpreadsheet
} from 'lucide-react';

interface Props {
    students: {
        data: Student[];
    };
}

export default function Index({ students }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // --- Helpers ---
    const getInitials = (name: string) => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // --- LOGIC WARNA & KATEGORI ---
    const getPointCategory = (poin: number) => {
        if (poin >= 90) {
            return {
                label: "Aman",
                color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
                icon: <ShieldCheck className="h-4 w-4 text-green-600" />
            };
        } else if (poin >= 50) {
            return {
                label: "Waspada",
                color: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
                icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />
            };
        } else {
            return {
                label: "Bahaya",
                color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
                icon: <Siren className="h-4 w-4 text-red-600" />
            };
        }
    };

    // --- Client-side Stats ---
    const stats = useMemo(() => {
        const total = students.data.length;
        // Poin Tinggi = Aman
        const safe = students.data.filter(s => s.total_poin >= 90).length;
        // Poin Sedang = Waspada (50 - 89)
        const warning = students.data.filter(s => s.total_poin >= 50 && s.total_poin < 90).length;
        // Poin Rendah = Bahaya (< 50)
        const critical = students.data.filter(s => s.total_poin < 50).length;

        return { total, safe, warning, critical };
    }, [students.data]);

    // Filter
    const filteredStudents = students.data.filter(s =>
        s.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery)
    );

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(`/students/${deleteId}`, {
                onFinish: () => setDeleteId(null),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/' },
                { title: 'Data Siswa', href: '/admin/students' },
            ]}
        >
            <Head title="Manajemen Siswa" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">

                {/* === HEADER === */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Data Siswa</h2>
                        <p className="text-muted-foreground">
                            Monitoring poin kedisiplinan dan data akademik siswa.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Export Excel
                        </Button>
                        <Button asChild size="sm">
                            <Link href="/admin/students/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Siswa
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* === STATS CARDS (Updated Logic) === */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">Siswa aktif</p>
                        </CardContent>
                    </Card>

                    {/* AMAN (HIJAU) */}
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Siswa Aman</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.safe}</div>
                            <p className="text-xs text-muted-foreground">Poin &ge; 90</p>
                        </CardContent>
                    </Card>

                    {/* WASPADA (KUNING) */}
                    <Card className="border-l-4 border-l-yellow-400">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
                            <p className="text-xs text-muted-foreground">Poin 50 - 89</p>
                        </CardContent>
                    </Card>

                    {/* BAHAYA (MERAH) */}
                    <Card className="border-l-4 border-l-red-500 bg-red-50/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sangat Kritis</CardTitle>
                            <Siren className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
                            <p className="text-xs text-muted-foreground">Poin &lt; 50</p>
                        </CardContent>
                    </Card>
                </div>

                {/* === TABLE === */}
                <Card className="flex flex-col">
                    <CardHeader className="px-6 py-4 border-b">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>Direktori Siswa</CardTitle>
                                <CardDescription>
                                    Daftar siswa beserta sisa poin kedisiplinan saat ini.
                                </CardDescription>
                            </div>
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau NISN..."
                                    className="pl-9 bg-background"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-[80px] pl-6">Profil</TableHead>
                                    <TableHead>Identitas Siswa</TableHead>
                                    <TableHead className="hidden md:table-cell">Kelas & Rombel</TableHead>
                                    <TableHead className="hidden md:table-cell">NISN</TableHead>
                                    <TableHead className="text-center">Sisa Poin</TableHead>
                                    <TableHead className="text-right pr-6">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="h-8 w-8 text-muted-foreground/30" />
                                                <p>Tidak ada data siswa ditemukan.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStudents.map((s) => {
                                        const status = getPointCategory(s.total_poin);

                                        return (
                                            <TableRow key={s.id} className="group">
                                                <TableCell className="pl-6 py-3">
                                                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                        <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                                            {getInitials(s.nama_lengkap)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{s.nama_lengkap}</span>
                                                        <span className="text-xs text-muted-foreground md:hidden">{s.kelas} {s.rombel}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant="outline" className="font-medium bg-muted/50">
                                                        {s.kelas} - {s.rombel}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell text-muted-foreground font-mono text-sm">
                                                    {s.nisn}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        className={`w-14 justify-center ${status.color}`}
                                                        variant="outline"
                                                    >
                                                        {s.total_poin}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuLabel>Pilihan</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => setSelectedStudent(s)}>
                                                                <Eye className="mr-2 h-4 w-4" /> Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/students/${s.id}/edit`}>
                                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteId(s.id)}
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* === DETAIL DIALOG === */}
                <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
                    <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden gap-0">
                        {selectedStudent && (
                            <>
                                {(() => {
                                    const status = getPointCategory(selectedStudent.total_poin);
                                    return (
                                        <>
                                            <DialogHeader className="p-6 pb-4 bg-muted/30">
                                                <div className="flex flex-col items-center text-center gap-3">
                                                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                                                        <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                                                            {getInitials(selectedStudent.nama_lengkap)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <DialogTitle className="text-xl">{selectedStudent.nama_lengkap}</DialogTitle>
                                                        <p className="text-sm text-muted-foreground">{selectedStudent.nisn}</p>
                                                    </div>

                                                    {/* Badge Status Besar */}
                                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                                                        {status.icon}
                                                        <span>{selectedStudent.total_poin} Poin ({status.label})</span>
                                                    </div>
                                                </div>
                                            </DialogHeader>

                                            <div className="p-6 space-y-6">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                            <School className="h-3 w-3" /> Kelas
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {selectedStudent.kelas} - {selectedStudent.rombel}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                            <Hash className="h-3 w-3" /> Jenis Kelamin
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {selectedStudent.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                            <Calendar className="h-3 w-3" /> Tgl Lahir
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {formatDate(selectedStudent.tanggal_lahir)}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                            <Phone className="h-3 w-3" /> Kontak
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {selectedStudent.no_hp || '-'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                                                        Tutup
                                                    </Button>
                                                    <Button asChild>
                                                        <Link href={`/admin/students/${selectedStudent.id}/edit`}>
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

                {/* === DELETE ALERT === */}
                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus data siswa ini?
                                <br />Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Hapus Permanen
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </AppLayout>
    );
}
