import { Link } from '@inertiajs/react';
import { ArrowRight, BriefcaseBusiness, ClipboardList } from 'lucide-react';

import { getRelativeTimeDifference } from '@/helper';
import { EmploymentSurveySubmittedNotificationPayload } from '@/types';

export default function NotificationSurveySubmitted({ data }: { data: EmploymentSurveySubmittedNotificationPayload | undefined }) {
    if (!data) {
        return null;
    }

    return (
        <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue text-white">
                    <ClipboardList className="size-5" />
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
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Survey snapshot</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Alumni</p>
                        <p className="mt-1 text-sm text-slate-700">{data.alumni_name}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Employment status</p>
                        <p className="mt-1 text-sm text-slate-700">{data.current_employed ?? 'Not provided'}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3 md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Current company</p>
                        <p className="mt-1 text-sm text-slate-700">{data.current_work_company ?? 'Not provided'}</p>
                    </div>
                </div>

                {data.action_url ? (
                    <div className="mt-5">
                        <Link
                            href={data.action_url}
                            className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue/90"
                        >
                            <BriefcaseBusiness className="size-4" />
                            Review employment record
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
