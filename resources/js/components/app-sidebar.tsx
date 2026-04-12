import { Link, usePage } from '@inertiajs/react';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { User } from '@/types';
import AppLogo from './app-logo';
import { home } from '@/routes';
import { NavAlumni } from './nav-alumni';
import { NavUser } from './nav-user';

export function AppSidebar() {
    const { props } = usePage<{ auth: { user: User } }>();
    const isAdmin = props.auth.user.user_type === 'admin';
    const isAlumni = props.auth.user.user_type === 'alumni';

    if (isAlumni) {
        return;
    }

    return (
        <Sidebar collapsible="icon" variant="inset" className=''>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={home()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent> 
                {isAdmin && <NavMain />}
                {isAlumni && <NavAlumni />}
            </SidebarContent>
        </Sidebar>
    );
}
