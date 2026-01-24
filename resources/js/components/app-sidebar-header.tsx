import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ReactNode } from 'react';
import { NavUser } from './nav-user';
import SearchBar from './search-bar';
import { TopNavUser } from './top-nav-user';
import { Bell, MessageCircle, MessageSquare } from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[],
}) {
    return (
        <header className="flex bg-white rounded-lg shadow m-4 mb-0 justify-between h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white'>
                        <MessageSquare size={18} className='mt-0.25'/>
                    </div>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white'>
                        <Bell size={17} />
                    </div>
                    <TopNavUser />
                </div>
        </header>
    );
}
