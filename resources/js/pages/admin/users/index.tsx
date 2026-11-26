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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Plus,
    Search,
    Shield,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';

interface ManagedUser {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    users: {
        data: ManagedUser[];
        current_page: number;
        last_page: number;
        total: number;
        links: PaginationLink[];
    };
    availableRoles: string[];
    filters: {
        search: string;
        role: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manajemen User & Role', href: '/admin/users' },
];

const ROLE_LABELS: Record<string, { label: string; className: string }> = {
    admin: {
        label: 'Admin',
        className: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    },
    staf_bk: {
        label: 'Staf BK',
        className: 'border-amber-200 bg-amber-50 text-amber-700',
    },
    siswa: {
        label: 'Siswa',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
};

export default function Index({ users, availableRoles, filters }: Props) {
    const { flash, auth } = usePage<SharedData>().props;
    const [searchQuery, setSearchQuery] = useState(filters.search ?? '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ManagedUser | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'staf_bk',
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'staf_bk',
    });

    const applyFilters = (next: Partial<typeof filters>) => {
        router.get(
            '/admin/users',
            {
                search: next.search ?? searchQuery,
                role: next.role ?? filters.role,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchQuery });
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/users', {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const openEdit = (user: ManagedUser) => {
        setEditTarget(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.roles[0] ?? 'siswa',
        });
        editForm.clearErrors();
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/admin/users/${editTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditTarget(null);
                editForm.reset();
            },
        });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/users/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen User & Role" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
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

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Manajemen User & Role
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola akun dan hak akses sistem (Admin, Staf BK,
                            dan Siswa).
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => {
                            createForm.reset();
                            createForm.clearErrors();
                            setIsCreateOpen(true);
                        }}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Tambah User
                    </Button>
                </div>

                <Card>
                    <CardHeader className="flex flex-col justify-between gap-4 border-b sm:flex-row sm:items-center">
                        <div>
                            <CardTitle className="text-lg">
                                Daftar Pengguna ({users.total})
                            </CardTitle>
                            <CardDescription>
                                Hanya Administrator yang dapat mengubah role
                                pengguna.
                            </CardDescription>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={filters.role || 'all'}
                                onValueChange={(val) =>
                                    applyFilters({ role: val })
                                }
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Semua Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Role
                                    </SelectItem>
                                    {availableRoles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {ROLE_LABELS[role]?.label ?? role}
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
                                    placeholder="Cari nama / email..."
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
                                    <TableHead className="pl-6">Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-center">
                                        Role
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Dibuat
                                    </TableHead>
                                    <TableHead className="pr-6 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-28 text-center text-muted-foreground"
                                        >
                                            Tidak ada user ditemukan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((u) => {
                                        const primaryRole =
                                            u.roles[0] ?? 'siswa';
                                        const roleMeta = ROLE_LABELS[
                                            primaryRole
                                        ] ?? {
                                            label: primaryRole,
                                            className: '',
                                        };
                                        const isSelf = auth.user?.id === u.id;

                                        return (
                                            <TableRow key={u.id}>
                                                <TableCell className="pl-6 font-medium">
                                                    {u.name}
                                                    {isSelf && (
                                                        <span className="ml-2 text-xs text-muted-foreground">
                                                            (Anda)
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {u.email}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            roleMeta.className
                                                        }
                                                    >
                                                        <Shield className="mr-1 h-3 w-3" />
                                                        {roleMeta.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-xs text-muted-foreground">
                                                    {u.created_at}
                                                </TableCell>
                                                <TableCell className="space-x-1 pr-6 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEdit(u)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={isSelf}
                                                        onClick={() =>
                                                            setDeleteTarget(u)
                                                        }
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>

                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-6 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Halaman {users.current_page} dari{' '}
                                    {users.last_page}
                                </p>
                                <div className="flex items-center gap-1">
                                    {users.links.map((link, idx) => {
                                        const isPrev = idx === 0;
                                        const isNext =
                                            idx === users.links.length - 1;
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

                {/* CREATE MODAL */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent>
                        <form onSubmit={submitCreate}>
                            <DialogHeader>
                                <DialogTitle>Tambah User Baru</DialogTitle>
                                <DialogDescription>
                                    Buat akun untuk Admin, Staf BK, atau Siswa.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-1.5">
                                    <Label>Nama Lengkap</Label>
                                    <Input
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {createForm.errors.name && (
                                        <p className="text-xs text-red-500">
                                            {createForm.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {createForm.errors.email && (
                                        <p className="text-xs text-red-500">
                                            {createForm.errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {createForm.errors.password && (
                                        <p className="text-xs text-red-500">
                                            {createForm.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Role</Label>
                                    <Select
                                        value={createForm.data.role}
                                        onValueChange={(val) =>
                                            createForm.setData('role', val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                            <SelectItem value="staf_bk">
                                                Staf BK
                                            </SelectItem>
                                            <SelectItem value="siswa">
                                                Siswa
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* EDIT MODAL */}
                <Dialog
                    open={!!editTarget}
                    onOpenChange={(open) => !open && setEditTarget(null)}
                >
                    <DialogContent>
                        <form onSubmit={submitEdit}>
                            <DialogHeader>
                                <DialogTitle>Edit User & Role</DialogTitle>
                                <DialogDescription>
                                    Ubah detail akun atau ganti role pengguna.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-1.5">
                                    <Label>Nama Lengkap</Label>
                                    <Input
                                        value={editForm.data.name}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-xs text-red-500">
                                            {editForm.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {editForm.errors.email && (
                                        <p className="text-xs text-red-500">
                                            {editForm.errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>
                                        Password Baru (Kosongkan jika tidak
                                        diubah)
                                    </Label>
                                    <Input
                                        type="password"
                                        value={editForm.data.password}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {editForm.errors.password && (
                                        <p className="text-xs text-red-500">
                                            {editForm.errors.password}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Role</Label>
                                    <Select
                                        value={editForm.data.role}
                                        onValueChange={(val) =>
                                            editForm.setData('role', val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                            <SelectItem value="staf_bk">
                                                Staf BK
                                            </SelectItem>
                                            <SelectItem value="siswa">
                                                Siswa
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditTarget(null)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                >
                                    Simpan Perubahan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* DELETE CONFIRMATION */}
                <AlertDialog
                    open={!!deleteTarget}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Akun <strong>{deleteTarget?.name}</strong> (
                                {deleteTarget?.email}) akan dihapus permanen.
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
