import { getRelativeTimeDifference } from '@/helper'
import { AppNotification, ImportReportNotificationPayload } from '@/types'
import { Import } from 'lucide-react'

const NotificationItem = ({ data }: { data: ImportReportNotificationPayload }) => {
    return (
        <div className='flex items-center gap-3'>
            {
                data && (
                    <>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white'>
                            <Import size={20} />
                        </div>
                        <div className='flex-1'>
                            <div className='w-full gap-2 flex items-center justify-between'>
                                <p>{data.title}</p>
                                <p className='text-xs'>{getRelativeTimeDifference(data.timestamp)}</p>
                            </div>
                            <p className='text-xs text-gray-600'>{data.message}</p>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default NotificationItem