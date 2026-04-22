import { Link } from '@inertiajs/react';
import { SquareArrowOutUpRight, UserRound } from 'lucide-react';

import { getRelativeTimeDifference } from '@/helper';
import { EmploymentSurveySubmittedNotificationPayload } from '@/types';
import { Button } from '../ui/button';
import Heading from '../heading';

export default function NotificationSurveySubmitted({ data }: { data: EmploymentSurveySubmittedNotificationPayload | undefined }) {
    if (!data) {
        return null;
    }

    return (
        <div className="h-full flex flex-col space-y-8">
            <div className="flex items-start gap-4 rounded-xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <UserRound className="size-5" />
                </div>

                <div className="min-w-0 flex-1 ">
                    <div className='flex justify-between'>
                        <Heading title={data.title} description={data.message} classname='mb-5' />
                        <p className="text-xs text-slate-500">{getRelativeTimeDifference(data.timestamp)}</p>

                    </div>

                    {data.action_url ? (
                        <div className="">
                            <Link href={data.action_url} as="div">
                                <Button className='bg-emerald-600'>
                                    <SquareArrowOutUpRight />
                                    Review account
                                </Button>
                            </Link>
                        </div>
                    ) : null}

                </div>
            </div>

            <div className="">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Account summary</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Alumni</p>
                        <p className="mt-1 text-sm text-slate-700">{data.alumni_name}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Status</p>
                        <p className="mt-1 text-sm text-slate-700">{data.account_status ?? 'Pending'}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Email</p>
                        <p className="mt-1 text-sm text-slate-700">{data.email ?? 'Not provided'}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">School level</p>
                        <p className="mt-1 text-sm text-slate-700">{data.school_level ?? 'Not provided'}</p>
                    </div>
                </div>
            </div>
            <div className='flex-1' />
        </div>
    );
}
