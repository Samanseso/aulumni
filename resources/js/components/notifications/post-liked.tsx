import { Link } from '@inertiajs/react';
import { ArrowRight, Heart, UserRound } from 'lucide-react';

import { getRelativeTimeDifference } from '@/helper';
import { PostLikedNotificationPayload } from '@/types';

export default function NotificationPostLiked({ data }: { data: PostLikedNotificationPayload | undefined }) {
    if (!data) {
        return null;
    }

    return (
        <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl border border-rose-100 bg-rose-50 p-5">
                <div className="flex size-12 items-center justify-center rounded-full bg-rose-500 text-white">
                    <Heart className="size-5 fill-current" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-slate-950">{data.title}</h2>
                        <p className="text-xs text-slate-500">{getRelativeTimeDifference(data.timestamp)}</p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">{data.message}</p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reaction details</p>

                <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Alumni</p>
                        <p className="mt-1 text-sm text-slate-700">{data.actor_name}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Post</p>
                        <p className="mt-1 text-sm text-slate-700">{data.job_title}</p>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {data.actor_user_name ? (
                        <Link
                            href={`/${data.actor_user_name}`}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                        >
                            <UserRound className="size-4" />
                            View alumni profile
                        </Link>
                    ) : null}

                    <Link
                        href={data.action_url ?? '/'}
                        className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue/90"
                    >
                        Open news feed
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
