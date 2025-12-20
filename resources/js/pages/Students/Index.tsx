import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { type Student } from '@/types';

interface Props {
    students: {
        data: Student[];
    };
}

export default function Index({ students }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Nonaktifkan siswa ini?')) {
            router.delete(`/students/${id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/' },
                { title: 'Students', href: '/students' },
            ]}
        >
            <Head title="Students" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Data Siswa</h1>
                    <Link
                        href="/students/create"
                        className="rounded bg-primary px-4 py-2 text-white"
                    >
                        Tambah Siswa
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-2 text-left">Nama</th>
                                <th className="p-2">NISN</th>
                                <th className="p-2">Kelas</th>
                                <th className="p-2">Poin</th>
                                <th className="p-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.data.map((s) => (
                                <tr key={s.id} className="border-t">
                                    <td className="p-2">{s.nama_lengkap}</td>
                                    <td className="p-2 text-center">{s.nisn}</td>
                                    <td className="p-2 text-center">
                                        {s.kelas} {s.rombel}
                                    </td>
                                    <td className="p-2 text-center">{s.total_poin}</td>
                                    <td className="p-2 flex gap-2 justify-center">
                                        <Link
                                            href={`/students/${s.id}/edit`}
                                            className="text-blue-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            className="text-red-600"
                                        >
                                            Nonaktifkan
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
