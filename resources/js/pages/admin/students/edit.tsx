import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type Student } from '@/types';

interface Props {
    student: Student;
}

export default function Edit({ student }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_lengkap: student.nama_lengkap,
        nisn: student.nisn,
        jenis_kelamin: student.jenis_kelamin,
        tanggal_lahir: student.tanggal_lahir
            ? student.tanggal_lahir.substring(0, 10)
            : '',
        kelas: student.kelas,
        rombel: student.rombel,
        tahun_ajaran: student.tahun_ajaran,
        no_hp: student.no_hp ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/students/${student.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/' },
                { title: 'Students', href: '/admin/students' },
                { title: 'Edit', href: `/admin/students/${student.id}/edit` },
            ]}
        >
            <Head title="Edit Siswa" />

            <div className="p-4 max-w-xl space-y-4">

                {Object.keys(errors).length > 0 && (
                    <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">
                        <ul className="list-disc pl-4">
                            {Object.values(errors).map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">

                    <input
                        className="input w-full"
                        placeholder="Nama Lengkap"
                        value={data.nama_lengkap}
                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                        required
                    />

                    <input
                        className="input w-full bg-gray-100"
                        value={data.nisn}
                        disabled
                    />

                    <select
                        className="input w-full"
                        value={data.jenis_kelamin}
                        onChange={(e) => setData('jenis_kelamin', e.target.value as 'L' | 'P')}
                    >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>

                    <input
                        type="date"
                        className="input w-full"
                        value={data.tanggal_lahir}
                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                        required
                    />

                    <input
                        className="input w-full"
                        placeholder="Kelas"
                        value={data.kelas}
                        onChange={(e) => setData('kelas', e.target.value)}
                        required
                    />

                    <input
                        className="input w-full"
                        placeholder="Rombel"
                        value={data.rombel}
                        onChange={(e) => setData('rombel', e.target.value)}
                        required
                    />

                    <input
                        className="input w-full"
                        placeholder="Tahun Ajaran"
                        value={data.tahun_ajaran}
                        onChange={(e) => setData('tahun_ajaran', e.target.value)}
                        required
                    />

                    <input
                        className="input w-full"
                        placeholder="No HP (opsional)"
                        value={data.no_hp}
                        onChange={(e) => setData('no_hp', e.target.value)}
                    />

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Update'}
                        </button>

                        <a
                            href="/students"
                            className="rounded border px-4 py-2"
                        >
                            Batal
                        </a>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
