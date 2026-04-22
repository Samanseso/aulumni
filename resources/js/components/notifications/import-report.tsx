import { Link } from '@inertiajs/react';
import { ArrowRight, CircleAlert, Download, FileWarning, Import } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { ImportReportNotificationPayload } from '@/types';
import { getRelativeTimeDifference } from '@/helper';
import Heading from '../heading';

type FieldDescriptor = {
    key: string;
    label: string;
};

const hiddenFields = new Set(['password', 'photo']);

const fieldOrder: FieldDescriptor[] = [
    { key: 'user_id', label: 'User ID' },
    { key: 'user_name', label: 'User Name' },
    { key: 'alumni_id', label: 'Alumni ID' },
    { key: 'first_name', label: 'First Name' },
    { key: 'middle_name', label: 'Middle Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'status', label: 'Status' },
    { key: 'gender', label: 'Gender' },
    { key: 'birthday', label: 'Birthday' },
    { key: 'bio', label: 'Bio' },
    { key: 'interest', label: 'Interest' },
    { key: 'address', label: 'Address' },
    { key: 'student_number', label: 'Student Number' },
    { key: 'school_level', label: 'School Level' },
    { key: 'batch', label: 'Batch' },
    { key: 'branch', label: 'Branch' },
    { key: 'course', label: 'Course' },
    { key: 'email', label: 'Email' },
    { key: 'contact', label: 'Contact' },
    { key: 'telephone', label: 'Telephone' },
    { key: 'mailing_address', label: 'Mailing Address' },
    { key: 'present_address', label: 'Present Address' },
    { key: 'provincial_address', label: 'Provincial Address' },
    { key: 'company_address', label: 'Company Address' },
    { key: 'facebook_url', label: 'Facebook URL' },
    { key: 'twitter_url', label: 'Twitter URL' },
    { key: 'gmail_url', label: 'Gmail URL' },
    { key: 'link_url', label: 'Link URL' },
    { key: 'other_url', label: 'Other URL' },
    { key: 'first_work_position', label: 'First Work Position' },
    { key: 'first_work_time_taken', label: 'First Work Time Taken' },
    { key: 'first_work_acquisition', label: 'First Work Acquisition' },
    { key: 'current_employed', label: 'Current Employed' },
    { key: 'current_work_type', label: 'Current Work Type' },
    { key: 'current_work_status', label: 'Current Work Status' },
    { key: 'current_work_company', label: 'Company' },
    { key: 'current_work_position', label: 'Position' },
    { key: 'current_work_years', label: 'Employee Year' },
    { key: 'current_work_monthly_income', label: 'Monthly Income' },
    { key: 'current_work_satisfaction', label: 'Satisfaction' },
    { key: 'au_skills', label: 'AU Skills' },
    { key: 'au_usefulness', label: 'AU Usefulness' },
];

export default function NotificationImportReport({ data }: { data: ImportReportNotificationPayload | undefined }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const failures = data?.report.failures ?? [];

    useEffect(() => {
        setSelectedIndex(0);
    }, [data?.timestamp]);

    useEffect(() => {
        if (selectedIndex > failures.length - 1) {
            setSelectedIndex(Math.max(failures.length - 1, 0));
        }
    }, [failures.length, selectedIndex]);

    const failure = failures[selectedIndex] ?? null;

    const failureValues = useMemo<Record<string, unknown>>(() => {
        if (!failure) {
            return {};
        }

        const rowValues = failure.values?.[0];

        if (rowValues && !Array.isArray(rowValues) && typeof rowValues === 'object') {
            return rowValues;
        }

        return {};
    }, [failure]);

    const visibleFields = useMemo(() => {
        const ordered = fieldOrder.filter(({ key }) => !hiddenFields.has(key));
        const dynamicKeys = Object.keys(failureValues).filter(
            (key) => !hiddenFields.has(key) && !ordered.some((field) => field.key === key),
        );

        return [
            ...ordered,
            ...dynamicKeys.map((key) => ({
                key,
                label: key.replace(/_/g, ' '),
            })),
        ].filter(({ key }) => key in failureValues);
    }, [failureValues]);

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-full bg-amber-500 text-white">
                    <Import className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className='flex justify-between'>
                        <Heading title={data.title} description={data.message} classname='mb-0' />
                        <p className="text-xs text-slate-500">{getRelativeTimeDifference(data.timestamp)}</p>

                    </div>
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Total rows</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{data.report.total ?? 0}</p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Succeeded</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-700">{data.report.succeeded ?? 0}</p>
                </div>

                <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Failed</p>
                    <p className="mt-2 text-2xl font-semibold text-rose-600">{data.report.failed ?? 0}</p>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Failure details</p>
                        <p className="mt-1 text-sm text-slate-500">
                            Review the rows that need fixing before your next import.
                        </p>
                    </div>

                    {data.report.report_url ? (
                        <Link
                            href={data.report.report_url}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                        >
                            <Download className="size-4" />
                            Download report
                        </Link>
                    ) : null}
                </div>

                {failure ? (
                    <div className="space-y-5 pt-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="rounded-xl bg-slate-50 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Selected row</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">Row {failure.row ?? selectedIndex + 1}</p>
                            </div>

                            {failures.length > 1 ? (
                                <div className="flex flex-wrap gap-2">
                                    {failures.map((item, index) => (
                                        <button
                                            key={`${item.row ?? index}-${index}`}
                                            type="button"
                                            onClick={() => setSelectedIndex(index)}
                                            className={cn(
                                                'rounded-full border px-3 py-1.5 text-sm font-medium transition',
                                                selectedIndex === index
                                                    ? 'border-blue bg-blue text-white'
                                                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                                            )}
                                        >
                                            Row {item.row ?? index + 1}
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                                    <FileWarning className="size-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-900">Validation issues</p>
                                    <div className="mt-3 space-y-2">
                                        {failure.errors.map((error, index) => (
                                            <div key={`${error}-${index}`} className="flex items-start gap-2 text-sm text-slate-600">
                                                <CircleAlert className="mt-0.5 size-4 shrink-0 text-rose-500" />
                                                <span>{error}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                            {visibleFields.length > 0 ? (
                                visibleFields.map(({ key, label }) => {
                                    const value = failureValues[key];
                                    const hasIssue = failure.attributes.includes(key);

                                    return (
                                        <div
                                            key={key}
                                            className={cn(
                                                'rounded-xl border px-4 py-3',
                                                hasIssue ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-slate-50',
                                            )}
                                        >
                                            <p className={cn(
                                                'text-xs font-semibold uppercase tracking-[0.14em]',
                                                hasIssue ? 'text-rose-500' : 'text-slate-400',
                                            )}>
                                                {label}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-slate-700">
                                                {value === null || value === undefined || value === '' ? 'Not provided' : String(value)}
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                    No row preview is available for this failure.
                                </div>
                            )}
                        </div>

                        {data.report.report_url ? (
                            <Link
                                href={data.report.report_url}
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue transition hover:text-blue/80"
                            >
                                Open the full import report
                                <ArrowRight className="size-4" />
                            </Link>
                        ) : null}
                    </div>
                ) : (
                    <div className="py-10 text-center">
                        <p className="text-sm font-medium text-slate-900">No failed rows</p>
                        <p className="mt-1 text-sm text-slate-500">This import finished without any validation issues.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
