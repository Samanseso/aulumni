import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useInitials } from '@/hooks/use-initials';
import { Button } from './ui/button';
import { TopNavUserAvatar } from './top-nav.user-avatar';

export function TopNavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const getInitials = useInitials();


    return (
        <DropdownMenu>
            <DropdownMenuTrigger >
                <TopNavUserAvatar user={auth.user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                side={
                    isMobile
                        ? 'bottom'
                        : state === 'collapsed'
                            ? 'left'
                            : 'bottom'
                }
            >
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
