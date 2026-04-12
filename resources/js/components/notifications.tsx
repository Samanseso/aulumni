import { Link } from '@inertiajs/react';
import { Bell } from 'lucide-react';

import { AppNotification } from '@/types';

import NotificationItem from './notification-item';

export default function Notifications({ notifs }: { notifs: AppNotification<any>[] }) {
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

            <div className="max-h-[26rem] overflow-auto p-2">
                <div className="space-y-1">
                    {notifs.slice(0, 6).map((notification) => (
                        <div key={notification.id} className="rounded-xl px-2 py-2 transition hover:bg-slate-50">
                            <NotificationItem notification={notification} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-200 p-2">
                <Link
                    href="/notifications"
                    className="flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-blue transition hover:bg-blue/5"
                >
                    View all notifications
                </Link>
            </div>
        </div>
    );
}
