import { Link } from '@inertiajs/react';
import { BookOpen, FileClock, Folder, LayoutGrid, User, Wrench } from 'lucide-react';

import { NavFooter } from '@/components/nav-footer';
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
import { type NavItem } from '@/types';
import AppLogo from './app-logo';




const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'User',
        href: '',
        icon: User,
        subNavItem: [
            {
                title: 'Alumni',
                href: '/user/alumni',
            },
            {
                title: 'Employee',
                href: '/user/employee',
            },
            {
                title: 'Admin',
                href: '/user/admin',
            }
        ]
    },
    {
        title: 'Utility',
        href: '',
        icon: Wrench,
        subNavItem: [
            {
                title: 'Branch',
                href: '/branch',
            },
            {
                title: 'Department',
                href: '/department',
            },
            {
                title: 'Course',
                href: '/course',
            }
        ]
    },
    {
        title: 'System Logs',
        href: '',
        icon: FileClock,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
