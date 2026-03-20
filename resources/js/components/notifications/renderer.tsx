import { notificationRegistry } from './registry'

type Props = {
    type: string
    data: any
}

export default function NotificationRenderer({ type, data }: Props) {
    const Component = notificationRegistry[type as keyof typeof notificationRegistry]

    if (!Component) {
        return (
            <div className="text-sm text-gray-500">
                Unsupported notification type: {type}
            </div>
        )
    }

    return <Component data={data} />
}