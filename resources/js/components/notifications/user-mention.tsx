import { Link } from '@inertiajs/react';
import { ArrowRight, MessageCircle } from 'lucide-react';

import { getRelativeTimeDifference } from '@/helper';
import { UserMentionPayload } from '@/types';

export default function NotificationUserMention({ data }: { data: UserMentionPayload | undefined }) {
    if (!data) {
        return null;
    }

    return (
        <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl border border-violet-100 bg-violet-50 p-5">
                <div className="flex size-12 items-center justify-center rounded-full bg-violet-500 text-white">
                    <MessageCircle className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-slate-950">{data.title}</h2>
                        <p className="text-xs text-slate-500">{getRelativeTimeDifference(data.timestamp)}</p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">{data.message}</p>
                </div>
            </div>

            {data.action_url ? (
                <Link
                    href={data.action_url}
                    className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue/90"
                >
                    Open notification context
                    <ArrowRight className="size-4" />
                </Link>
            ) : null}
        </div>
    );
}
