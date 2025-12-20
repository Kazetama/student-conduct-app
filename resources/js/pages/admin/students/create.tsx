import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        nisn: '',
        jenis_kelamin: 'L',
        tanggal_lahir: '',
        kelas: '',
        rombel: '',
        tahun_ajaran: '2024/2025',
        no_hp: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/students', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/' },
                { title: 'Students', href: '/admin/students' },
                { title: 'Create', href: '/admin/students/create' },
            ]}
        >
            <Head title="Tambah Siswa" />

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
                        className="input w-full"
                        placeholder="NISN (10 digit)"
                        value={data.nisn}
                        onChange={(e) => setData('nisn', e.target.value)}
                        required
                    />

                    <select
                        className="input w-full"
                        value={data.jenis_kelamin}
                        onChange={(e) => setData('jenis_kelamin', e.target.value)}
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
                        placeholder="Kelas (VII / VIII / IX)"
                        value={data.kelas}
                        onChange={(e) => setData('kelas', e.target.value)}
                        required
                    />

                    <input
                        className="input w-full"
                        placeholder="Rombel (A / B)"
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

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
