import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ClipboardList,
    Gavel,
    History,
    LayoutGrid,
    Shield,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const roles = auth.roles ?? [];
    const isAdmin = roles.includes('admin');
    const isStafBk = roles.includes('staf_bk');

    const homeHref = isAdmin ? dashboard() : '/bk/dashboard';

    const mainNavItems: NavItem[] = isAdmin
        ? [
              {
                  title: 'Dashboard Admin',
                  href: dashboard(),
                  icon: LayoutGrid,
              },
              {
                  title: 'Manajemen User & Role',
                  href: '/admin/users',
                  icon: Shield,
              },
              {
                  title: 'Manajemen Siswa',
                  href: '/admin/students',
                  icon: Users,
              },
              {
                  title: 'Aturan Poin',
                  href: '/admin/point-rules',
                  icon: ClipboardList,
              },
          ]
        : isStafBk
          ? [
                {
                    title: 'Dashboard BK',
                    href: '/bk/dashboard',
                    icon: LayoutGrid,
                },
                {
                    title: 'Input Poin Siswa',
                    href: '/bk/student-points/create',
                    icon: Gavel,
                },
                {
                    title: 'Riwayat Poin',
                    href: '/bk/student-points',
                    icon: History,
                },
                {
                    title: 'Monitoring Siswa',
                    href: '/bk/students',
                    icon: Users,
                },
            ]
          : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
