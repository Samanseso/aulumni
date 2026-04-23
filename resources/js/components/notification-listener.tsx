import { SetStateAction, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

import { AppNotification, User } from '@/types';

interface NotificationsListenerProps {
	setNotifs: React.Dispatch<SetStateAction<AppNotification<any>[]>>;
}

function normalizeNotification(payload: any): AppNotification<any> {
	if (payload?.data) {
		return {
			id: payload.id,
			type: payload.type,
			data: payload.data,
			read_at: payload.read_at ?? null,
			created_at: payload.created_at ?? payload.data?.timestamp ?? null,
			updated_at: payload.updated_at ?? null,
		};
	}

	return {
		id: crypto.randomUUID(),
		type: payload?.type ?? 'unknown',
		data: payload ?? {},
		read_at: null,
		created_at: payload?.timestamp ?? new Date().toISOString(),
		updated_at: null,
	};
}

export default function NotificationsListener({ setNotifs }: NotificationsListenerProps) {
	const { props } = usePage<{ auth: { user: User } }>();
	const userId = props.auth.user.user_id;

	useEffect(() => {
		if (!userId || !window.Echo) return;

		const channelName = `App.Models.User.${userId}`;
		const channel = window.Echo.private(channelName);

		// console.log('Subscribing to notification channel:', channelName);

		// channel.subscribed(() => {
		// 	console.log('Subscribed to notification channel:', channelName);
		// });

		// channel.error((error: any) => {
		// 	console.error('Notification channel subscription error:', error);
		// });

		channel.notification((payload: any) => {
			// console.log('Received notification:', payload);
			const incoming = normalizeNotification(payload);

			setNotifs((previous) => [incoming, ...previous.filter((notification) => notification.id !== incoming.id)]);
		});

		return () => {
			try {
				window.Echo.leave(channelName);
			} catch (error) {
				console.error(error);
			}
		};
	}, [userId, setNotifs]);

	return null;
}
