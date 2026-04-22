import { Bell, ClipboardList, Heart, Import, MessageCircle } from 'lucide-react';

import { getRelativeTimeDifference } from '@/helper';
import { AppNotification } from '@/types';

const appearance = {
    'App\\Notifications\\ImportReportNotification': {
        icon: Import,
        iconClassName: 'bg-amber-100 text-amber-700',
    },
    'App\\Notifications\\PostLikedNotification': {
        icon: Heart,
        iconClassName: 'bg-rose-100 text-rose-600',
    },
    'App\\Notifications\\EmploymentSurveySubmittedNotification': {
        icon: ClipboardList,
        iconClassName: 'bg-blue-100 text-blue-700',
    },
    'App\\Notifications\\UserMentionNotification': {
        icon: MessageCircle,
        iconClassName: 'bg-violet-100 text-violet-700',
    },
} as const;

export default function NotificationItem({ notification }: { notification: AppNotification<any> }) {
    const data = notification.data ?? {};
    const title = data.title ?? 'Notification';
    const message = data.message ?? 'You have a new notification.';
    const timestamp = data.timestamp ?? notification.created_at ?? null;
    const config = appearance[notification.type as keyof typeof appearance];
    const Icon = config?.icon ?? Bell;

    return (
        <div className="flex items-start gap-3 p-3">
            <div className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ${config?.iconClassName ?? 'bg-slate-100 text-slate-600'}`}>
                <Icon size={18} className={notification.type === 'App\\Notifications\\PostLikedNotification' ? 'fill-current' : undefined} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                    <p className="line-clamp-1 text-sm font-medium text-slate-900">{title}</p>
                    {timestamp ? (
                        <p className="shrink-0 text-xs text-slate-400">{getRelativeTimeDifference(timestamp)}</p>
                    ) : null}
                </div>

                <div className="mt-1 flex items-start gap-2">
                    {!notification.read_at ? (
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-blue translate-y-[2px]" />
                    ) : null}
                    <p className="line-clamp-2 text-xs leading-5 text-slate-500">{message}</p>
                </div>
            </div>
        </div>
    );
}
