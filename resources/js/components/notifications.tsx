import { AppNotification, ImportReportNotificationPayload } from '@/types'
import React, { ReactNode, useState } from 'react'
import NotificationImportReport from './notification-item';
import { usePage } from '@inertiajs/react';
import NotificationsListener from './notification-listener';

const Notifications = ({ notifs }: { notifs: ImportReportNotificationPayload[]}) => {


    return (
        <div className='p-2 space-y-4'>
            {notifs.map(notif => {
                return (
                    <NotificationImportReport key={notif.timestamp} data={notif as ImportReportNotificationPayload} />
                )
            })}
        </div>
    )   
}

export default Notifications