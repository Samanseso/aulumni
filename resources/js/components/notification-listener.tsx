import { SetStateAction, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { AppNotification, ImportReportNotificationPayload, User } from '@/types';

interface NotificationsListenerProps {
	setNotifs: React.Dispatch<SetStateAction<ImportReportNotificationPayload[]>>;
}

export default function NotificationsListener({ setNotifs }: NotificationsListenerProps) {
	const { props } = usePage<{ auth: { user: User } }>();
	const userId = props.auth.user.user_id;

	useEffect(() => {
		if (!userId || !window.Echo) return;

		const channel = window.Echo.private(`App.Models.User.${userId}`);

		channel.notification((payload: ImportReportNotificationPayload) => {
			setNotifs(prev => [payload, ...prev]);
			console.log(payload);
		});

		return () => {
			try {
				channel.stopListening('.ImportReportNotification');
				window.Echo.leave(`App.Models.User.${userId}`);
			} catch (e) { }
		};
	}, [userId]);

	return null;
}
