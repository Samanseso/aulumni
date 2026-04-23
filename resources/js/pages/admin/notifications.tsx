import { Head, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

import NotificationItem from '@/components/notification-item';
import NotificationRenderer from '@/components/notifications/renderer';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { index } from '@/routes/notifications';
import { AppNotification, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: index().url,
    },
];

export default function Notifications() {

    const param = new URLSearchParams(window.location.search);
    const notificationId = param.get('selected');

    const { props } = usePage<{ notifications: AppNotification<any>[] }>();

    const selectedNotification = props.notifications.find((n) => n.id === notificationId) ?? props.notifications[0] ?? null;

    const [selected, setSelected] = useState<AppNotification<any> | null>(selectedNotification);

    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        setSelected(selectedNotification);
    }, [props.notifications]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />

            <div className="grid gap-4 p-4 pb-0 xl:grid-cols-[360px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm h-[calc(100vh-110px)]">
                    <div className="border-b border-slate-200 px-4 py-4">
                        <p className="text-sm font-semibold text-slate-900">Inbox</p>
                        <p className="text-xs text-slate-500">Recent updates from across the system</p>
                    </div>
                    
                    {props.notifications.length > 0 ? (
                        <div
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}
                            className={cn(
                                "max-h-[calc(100vh-188px)] ps-2 pe-0.5 pt-2 overflow-auto overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5",
                                "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded",
                                hovering ? "[&::-webkit-scrollbar-thumb]:bg-gray-300" : "[&::-webkit-scrollbar-thumb]:bg-transparent"
                            )}>
                            <div className="space-y-1">
                                {props.notifications.map((notification) => (
                                    <button
                                        key={notification.id}
                                        type="button"
                                        onClick={() => setSelected(notification)}
                                        className={cn(
                                            'w-full rounded-xl px-3 py-3 text-left transition cursor-pointer',
                                            selected?.id === notification.id ? 'bg-slate-100' : 'hover:bg-slate-50',
                                        )}
                                    >
                                        <NotificationItem notification={notification} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <Bell className="size-5" />
                            </div>
                            <p className="mt-4 text-sm font-medium text-slate-900">No notifications yet</p>
                            <p className="mt-1 text-xs text-slate-500">New activity will appear here automatically.</p>
                        </div>
                    )}
                </div>

                <div className="h-[calc(100vh-110px)] rounded-xl border border-slate-200 bg-white p-6 shadow-sm overflow-y-auto 
                            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded
                            [&::-webkit-scrollbar-thumb]:bg-gray-300">
                    {selected ? (
                        <NotificationRenderer type={selected.type} data={selected.data} />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <Bell className="size-6" />
                            </div>
                            <p className="mt-4 text-base font-semibold text-slate-900">Select a notification</p>
                            <p className="mt-1 max-w-sm text-sm text-slate-500">
                                Open any notification from the left panel to view its details here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout >
    );
}
