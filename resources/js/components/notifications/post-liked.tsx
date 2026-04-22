import { Link } from '@inertiajs/react';
import { ArrowRight, Heart, SquareArrowOutUpRight, UserRound } from 'lucide-react';

import { getRelativeTimeDifference } from '@/helper';
import { PostLikedNotificationPayload } from '@/types';
import Heading from '../heading';
import { Button } from '../ui/button';
import { useState } from 'react';
import PostModal from '../post-modal';

export default function NotificationPostLiked({ data }: { data: PostLikedNotificationPayload | undefined }) {
    if (!data) {
        return null;
    }

    const [viewPostId, setViewPostId] = useState<number | null>(null);

    return (
        <div className="space-y-8">

            {viewPostId !== null && (
                <PostModal post_id={viewPostId} setViewPostId={setViewPostId} />
            )}

            <div className="flex items-start gap-4 rounded-xl border border-rose-100 bg-rose-50 p-5 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-full bg-rose-500 text-white">
                    <Heart className="size-5 fill-current" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className='flex justify-between'>
                        <Heading title={data.title} description={data.message} classname='mb-5' />
                        <p className="text-xs text-slate-500">{getRelativeTimeDifference(data.timestamp)}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button className='bg-rose-500' onClick={() => setViewPostId(data.post_id)}>
                            <SquareArrowOutUpRight />
                            View post
                        </Button>
                    </div>

                </div>
            </div>

            <div className="rounded-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reaction details</p>

                <div className="mt-4 grid gap-3">
                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Alumni</p>
                        <p className="mt-1 text-sm text-slate-700">{data.actor_name}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Post</p>
                        <p className="mt-1 text-sm text-slate-700">{data.job_title}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
