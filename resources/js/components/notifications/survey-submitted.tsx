import { Link } from '@inertiajs/react';
import { ArrowRight, BriefcaseBusiness, ClipboardList, SquareArrowOutUpRight, SquareArrowUpRight } from 'lucide-react';

import { getRelativeTimeDifference } from '@/helper';
import { EmploymentSurveySubmittedNotificationPayload } from '@/types';
import { Button } from '../ui/button';
import Heading from '../heading';

export default function NotificationSurveySubmitted({ data }: { data: EmploymentSurveySubmittedNotificationPayload | undefined }) {
    if (!data) {
        return null;
    }

    return (
        <div className="h-full flex flex-col  space-y-8">
            <div className="flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue text-white">
                    <ClipboardList className="size-5" />
                </div>

                <div className="min-w-0 flex-1 ">
                    <div className='flex justify-between'>
                        <Heading title={data.title} description={data.message} classname='mb-5' />
                        <p className="text-xs text-slate-500">{getRelativeTimeDifference(data.timestamp)}</p>

                    </div>

                    {data.action_url ? (
                        <div className="">
                            <Link href={data.action_url} as="div">
                                <Button>
                                    <SquareArrowOutUpRight />
                                    Review employment record
                                </Button>
                            </Link>
                        </div>
                    ) : null}

                </div>
            </div>

            <div className="">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Survey summary</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Alumni</p>
                        <p className="mt-1 text-sm text-slate-700">{data.alumni_name}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Employment status</p>
                        <p className="mt-1 text-sm text-slate-700">{data.current_employed ?? 'Not provided'}</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3 md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Current company</p>
                        <p className="mt-1 text-sm text-slate-700">{data.current_work_company ?? 'Not provided'}</p>
                    </div>
                </div>
            </div>
            <div className='flex-1' />
        </div>
    );
}
