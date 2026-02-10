import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ReactNode } from 'react';
import { NavUser } from './nav-user';
import SearchBar from './search-bar';
import { TopNavUser } from './top-nav-user';
import { Bell, MessageCircle, MessageSquare } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import aulogo from "../../../public/assets/images/aulogo.png";
import { cn } from '@/lib/utils';


export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[],
}) {

    const { props } = usePage<{ auth: { user: User } }>();

    return (
        <header className={cn(
            "flex bg-white rounded-lg shadow m-4 mb-0 justify-between h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4",
            props.auth.user.user_type == "alumni" && "rounded-none m-0"
        )}>

            <div className="flex items-center gap-2">
                {props.auth.user.user_type === "alumni" ?
                    <>
                        <div className="flex aspect-square size-12 items-center justify-center text-sidebar-primary-foreground">
                            <img src={aulogo} alt="aulumni logo" />
                        </div>
                        <div className="ml-1 grid flex-1 text-left text-sm">
                            <span className="mb-0.5 truncate leading-tight font-semibold text-xl text-black">
                                aulumni
                            </span>
                        </div>
                    </> : <SidebarTrigger className="-ml-1" />
                }
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white'>
                    <MessageSquare size={18} className='mt-0.25' />
                </div>
                <div className='flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white'>
                    <Bell size={17} />
                </div>
                <TopNavUser />
            </div>
        </header>
    );
}
