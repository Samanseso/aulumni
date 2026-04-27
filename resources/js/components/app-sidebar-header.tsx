import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AppNotification, User, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ReactNode, useEffect, useState } from 'react';
import { NavUser } from './nav-user';
import SearchBar from './search-bar';
import { TopNavUser } from './top-nav-user';
import { Bell, Bookmark, Briefcase, BriefcaseBusiness, Building2, HandHelping, Home, Megaphone, MessageCircle, MessageSquare, Network } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import aulogo from "../../../public/assets/images/aulogo.png";
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import Notifications from './notifications';
import NotificationsListener from './notification-listener';
import { useActiveUrl } from '@/hooks/use-active-url';


export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {

    const { props } = usePage<{ auth: { user: User }, notifications: AppNotification<any>[] }>();
    const isAlumni = props.auth.user.user_type === 'alumni';
    const isAdmin = props.auth.user.user_type === 'admin';

    const hasSidebar = ['admin', 'employee'].includes(props.auth.user.user_type);
    const [notifs, setNotifs] = useState<AppNotification<any>[]>(props.notifications);
    const [newNotifsCount, setNewNotifsCount] = useState(0);

    const { urlIsActive } = useActiveUrl();


    useEffect(() => {
        setNewNotifsCount(notifs.filter(n => n && n.read_at == null).length);
    }, [notifs]);

    useEffect(() => {
        setNotifs(props.notifications);
    }, [props.notifications]);


    return (
        <header className={cn(
            "flex bg-white rounded-lg shadow m-4 mb-0 justify-between h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-3 transition-[width,height] ease-linear md:px-4",
            !isAdmin && "rounded-none m-0"
        )}>

            <div className="relative flex items-center gap-2">
                {hasSidebar && <SidebarTrigger className="-ml-1" />}
                {isAlumni ?
                    <>
                        <Link href={"/"} className="flex aspect-square size-10 items-center justify-center text-sidebar-primary-foreground cursor-pointer" as="div">
                            <img src={aulogo} alt="aulumni logo" /> 
                        </Link>
                        <div className="ml-1 grid flex-1 text-left text-sm">
                            <SearchBar classname="bg-muted" />
                        </div>
                    </> : null
                }
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {
                isAlumni &&
                <div className='absolute w-[33vw] left-[50%] -translate-x-[50%] flex gap-2'>
                    <Link href="/" className={cn(
                        "flex-1 cursor-pointer py-2",
                        urlIsActive('/') && "border-b-3 border-blue text-blue"
                    )}>
                        <Home size={20} className='mx-auto' />
                    </Link>

                    <Link href="/find-job" className={cn(
                        "flex-1 cursor-pointer py-2",
                        urlIsActive('/find-job') && "border-b-3 border-blue text-blue"
                    )}>
                        <BriefcaseBusiness size={20} className='mx-auto' />
                    </Link>

                    <Link href="/saved-job" className={cn(
                        "flex-1 cursor-pointer py-2",
                        urlIsActive('/saved-job') && "border-b-3 border-blue text-blue"
                    )}>
                        <Bookmark size={20} className='mx-auto' />
                    </Link>                
                </div>
            }


            <div className='flex items-center justify-between gap-2'>
                <NotificationsListener setNotifs={setNotifs} />

                <DropdownMenu>
                    <DropdownMenuTrigger className='rounded-full focus:outline-0 cursor-pointer'>
                        <div className='relative flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white'>
                            {newNotifsCount > 0 &&
                                <div className='absolute top-[-3px] right-[-3px] h-4.5 w-4.5 rounded-full flex items-center justify-center bg-red'>
                                    <span className='text-xs text-white'>{newNotifsCount}</span>
                                </div>
                            }

                            <Bell size={17} />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-sm p-0' align='end'>
                        {notifs && <Notifications notifs={notifs} />}
                    </DropdownMenuContent>
                </DropdownMenu>

                <TopNavUser />
            </div>
        </header>
    );
}
