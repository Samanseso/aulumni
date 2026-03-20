import { Head, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import NotificationRenderer from '@/components/notifications/renderer'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import NotificationItem from '@/components/notification-item'
import { BreadcrumbItem, ImportReportNotificationPayload } from '@/types'
import { index } from '@/routes/notifications'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: index().url,
    },
];


const Notifications = () => {
    const { props } = usePage<{ notifications: any[] }>()
    const [selected, setSelected] = useState(props.notifications[0] ?? null)

    useEffect(() => {
        setSelected(props.notifications[0]);
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />

            <div className="flex gap-4 p-4">

                {/* Notification List */}
                <div className="flex-1">
                    {props.notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => setSelected(notif)}
                            className={cn(
                                'p-3 rounded-lg cursor-pointer',
                                selected?.id === notif.id
                                    ? 'bg-white shadow'
                                    : 'hover:bg-gray-100'
                            )}
                        >
                            <NotificationItem data={notif.data} />
                        </div>
                    ))}
                </div>

                {/* Notification Detail */}
                <div className="flex-2 bg-white rounded-lg shadow h-[calc(100vh-115px)] p-6">
                    {selected && (
                        <NotificationRenderer
                            type={selected.type}
                            data={selected.data}
                        />
                    )}
                </div>

            </div>
        </AppLayout>
    )
}

export default Notifications