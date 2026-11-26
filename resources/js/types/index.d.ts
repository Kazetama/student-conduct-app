import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    roles?: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface FlashMessages {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash?: FlashMessages;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Student {
    id: number;
    nama_lengkap: string;
    nisn: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string;
    kelas: string;
    rombel: string;
    total_poin: number;
    sp_level?: number;
    tahun_ajaran: string;
    no_hp?: string | null;
    is_active: boolean;
}

export interface PointRule {
    id: number;
    nama: string;
    type: 'reward' | 'penalty';
    kategori: 'ringan' | 'sedang' | 'berat' | 'semester';
    point: number;
    max_per_period?: number | null;
    is_active: boolean;
}

export interface StudentPointRecord {
    id: number;
    student_id: number;
    point_rule_id: number;
    point: number;
    periode: string;
    keterangan?: string | null;
    tanggal: string;
    created_at?: string;
    student?: Pick<Student, 'id' | 'nama_lengkap' | 'nisn' | 'kelas' | 'rombel' | 'total_poin'>;
    point_rule?: Pick<PointRule, 'id' | 'nama' | 'type' | 'kategori'>;
}
