import { Link } from '@inertiajs/react';
import { Bell } from 'lucide-react';

import { AppNotification } from '@/types';

import NotificationItem from './notification-item';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Notifications({ notifs }: { notifs: AppNotification<any>[] }) {

    const [hovering, setHovering] = useState(false);

    if (notifs.length === 0) {
        return (
            <div className="w-sm px-4 py-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Bell className="size-5" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-900">No notifications yet</p>
                <p className="mt-1 text-xs text-slate-500">We&apos;ll show updates here once something happens.</p>
            </div>
        );
    }

    return (
        <div className="w-sm">
            <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <p className="text-xs text-slate-500">Recent updates for your account</p>
            </div>

            <div
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={cn(
                    "max-h-[26rem] overflow-auto ps-1.5 h-[65vh] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5",
                    "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded",
                    hovering ? "[&::-webkit-scrollbar-thumb]:bg-gray-300" : "[&::-webkit-scrollbar-thumb]:bg-transparent"
                )}

            >
                <div className="space-y-1">
                    {notifs.slice(0, 6).map((notification) => (
                        <Link key={notification.id} href={`/notifications?selected=${notification.id}`} className="hover:bg-slate-50 cursor-pointer" as="div">
                            <NotificationItem notification={notification} />
                        </Link>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-200">
                <Link
                    href="/notifications"
                    className="flex items-center justify-center p-3 text-sm font-medium text-blue transition hover:bg-blue/5"
                >
                    View all notifications
                </Link>
            </div>
        </div>
    );
}
