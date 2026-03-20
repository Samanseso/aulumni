import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ImportReportNotificationPayload } from '@/types'
import { Button } from '../ui/button';
import { BellOff, Bug, Check, ChevronLeft, ChevronRight, ChevronUp, CircleAlert, Import, Trash } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { getRelativeTimeDifference } from '@/helper';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Link } from '@inertiajs/react';



const NotificationImportReport = ({
    data,
}: {
    data: ImportReportNotificationPayload | undefined
}) => {
    if (!data) return null;

    const { report } = data;
    const hiddenFields = ['password', 'photo'];

    const failures = report.failures ?? [];
    const totalFailures = failures.length;

    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    // clamp selectedIndex if failures change
    if (selectedIndex >= totalFailures && totalFailures > 0) {
        setSelectedIndex(totalFailures - 1);
    }

    if (totalFailures === 0) {
        return <div className="text-sm text-gray-600">No failures to show.</div>;
    }

    const failure = failures[selectedIndex];
    const values = failure.values?.[0] ?? {};

    const fieldOrder: Array<{ key: string; label: string }> = [
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

    return (
        <div className="relative h-full space-y-6">
            <div>
                <div className='flex-1'>
                    <div className='w-full gap-2 flex items-center justify-between'>
                        <p>{data.title}</p>
                        <p className='text-xs'>{getRelativeTimeDifference(data.timestamp)}</p>
                    </div>
                    <p className='text-xs text-gray-600'>{data.message}</p>
                </div>
            </div>

            <div className="rounded-lg space-y-4">
                <h3 className="font-semibold text-red-500">Row {failure.row}</h3>

                <div>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
                        {fieldOrder
                            .filter(({ key }) => !hiddenFields.includes(key))
                            .map(({ key, label }) => {
                                const value = (values as Record<string, unknown>)[key];
                                const isAttr = failure.attributes.includes(key);
                                const errorIndex = failure.attributes.indexOf(key);

                                return (
                                    <div className="flex items-center" key={key}>
                                        <p
                                            className={cn(
                                                'w-55 truncate',
                                                isAttr && 'font-bold text-red-600'
                                            )}
                                        >
                                            <span className="text-[11px] font-semibold uppercase text-gray-500">
                                                {label}:
                                            </span>
                                            &nbsp;&nbsp;&nbsp;
                                            <span>
                                                {value ? String(value) : '-'}
                                            </span>
                                        </p>

                                        {isAttr && (
                                            <TooltipProvider delayDuration={0} key={`${key}-tooltip`}>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <CircleAlert size={16} className="text-red-500 flex-shrink-0" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <span>
                                                            {failure.errors[errorIndex]}
                                                        </span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>



            <div className="absolute bottom-0  w-full flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <Link as="div">
                        <Button><Check />Mark as read</Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-0 cursor-pointer" asChild>
                            <Button variant="ghost" className="focus:outline-0">
                                More
                                <ChevronUp size={18} />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => { }}>
                                <Trash /> Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { }}>
                                <BellOff />  Turn off notifications for all imports
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { }}>
                                <Bug />  Report an issue
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">

                    {
                        selectedIndex !== 0 &&
                        <Button
                            onClick={() => setSelectedIndex((s) => Math.max(0, s - 1))}
                            disabled={selectedIndex === 0}
                            aria-label="Previous failure"
                            variant="outline" size="icon"
                        >
                            <ChevronLeft />
                        </Button>

                    }

                    {Array.from({ length: totalFailures }, (_, idx) => {
                        const pageNum = idx + 1;
                        const isActive = idx === selectedIndex;
                        return (
                            <Button
                                key={pageNum}
                                onClick={() => setSelectedIndex(idx)}
                                size="icon"
                                variant="outline"
                                className={cn(
                                    isActive && 'bg-blue text-white'
                                )}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {pageNum}
                            </Button>
                        );
                    })}

                    {
                        selectedIndex !== totalFailures - 1 &&
                        <Button
                            onClick={() => setSelectedIndex((s) => Math.min(totalFailures - 1, s + 1))}
                            disabled={selectedIndex === totalFailures - 1}
                            aria-label="Next failure"
                            variant="outline" size="icon"
                        >
                            <ChevronRight />
                        </Button>
                    }

                </div>
            </div>
        </div>
    );
};

export default NotificationImportReport;
