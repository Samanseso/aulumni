import { Link } from '@inertiajs/react';
import { BriefcaseBusiness, Building2, Copy, ExternalLink, GraduationCap } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useActiveUrl } from '@/hooks/use-active-url';
import { cn } from '@/lib/utils';
import type { Alumni } from '@/types';

interface AlumniProfileLayoutProps extends PropsWithChildren {
    alumni: Alumni;
}

export default function AlumniProfileLayout({ alumni, children }: AlumniProfileLayoutProps) {
    const { urlIsActive } = useActiveUrl();
    const [copied, setCopied] = useState(false);

    const publicProfileUrl = `/${alumni.user_name}`;
    const tabs = [
        { text: 'All', href: `/user/alumni/${alumni.user_name}` },
        { text: 'Personal', href: `/user/alumni/${alumni.user_name}/personal` },
        { text: 'Academic', href: `/user/alumni/${alumni.user_name}/academic` },
        { text: 'Contact', href: `/user/alumni/${alumni.user_name}/contact` },
        { text: 'Employment', href: `/user/alumni/${alumni.user_name}/employment` },
    ];

    const quickFacts = [
        {
            label: 'Education',
            value: alumni.academic_details?.school_level,
            icon: <GraduationCap className="size-4" />,
        },
        {
            label: 'Branch',
            value: alumni.academic_details?.branch,
            icon: <Building2 className="size-4" />,
        },
        {
            label: 'Current work',
            value: alumni.employment_details?.current_work_company,
            icon: <BriefcaseBusiness className="size-4" />,
        },
    ].filter((item) => item.value);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.origin + publicProfileUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    return (
        <div className="m-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="h-56 bg-slate-200" />

            <div className="mx-auto max-w-5xl px-6 pb-8">
                <div className="-mt-14 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-end">
                        <div className="rounded-full border-4 border-white bg-white shadow-xl">
                            <img
                                className="h-42 w-42 rounded-full object-cover"
                                src="/assets/images/default-profile.png"
                                alt={`${alumni.name} profile`}
                            />
                        </div>
                        

                        <div className='flex-1 flex justify-between'>
                            <div className="pb-1">
                                <Heading
                                    title={alumni.name}
                                    description={`${alumni.email} | @${alumni.user_name}`}
                                    classname="mb-0"
                                />

                                {quickFacts.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {quickFacts.map((fact) => (
                                            <div
                                                key={fact.label}
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600"
                                            >
                                                {fact.icon}
                                                <span>{fact.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="outline" onClick={handleCopy}>
                                    <Copy className="size-4" />
                                    {copied ? 'Copied' : 'Copy public link'}
                                </Button>
                                <Button asChild>
                                    <Link href={publicProfileUrl}>
                                        <ExternalLink className="size-4" />
                                        View public profile
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-3">
                    <div className="flex flex-wrap gap-2 mb-5">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.text}
                                href={tab.href}
                                className={cn(
                                    'rounded-full px-4 py-2 text-sm font-medium transition',
                                    urlIsActive(tab.href)
                                        ? 'bg-blue text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100'
                                )}
                            >
                                {tab.text}
                            </Link>
                        ))}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
