import { Link } from '@inertiajs/react';
import { BriefcaseBusiness, Copy, ExternalLink, GraduationCap } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useActiveUrl } from '@/hooks/use-active-url';
import type { Alumni } from '@/types';

interface AlumniProfileTab {
    text: string;
    href: string;
}

interface AlumniProfileLayoutProps extends PropsWithChildren {
    alumni: Alumni;
    tabs?: AlumniProfileTab[];
    actions?: ReactNode;
    publicProfileUrl?: string;
}

export default function AlumniProfileLayout({
    alumni,
    children,
    tabs,
    actions,
    publicProfileUrl,
}: AlumniProfileLayoutProps) {
    const { urlIsActive } = useActiveUrl();
    const [copied, setCopied] = useState(false);

    const resolvedPublicProfileUrl = publicProfileUrl ?? `/${alumni.user_name}`;
    const resolvedTabs = tabs ?? [
        { text: 'All', href: `/user/alumni/${alumni.user_name}` },
        { text: 'Personal', href: `/user/alumni/${alumni.user_name}/personal` },
        { text: 'Academic', href: `/user/alumni/${alumni.user_name}/academic` },
        { text: 'Contact', href: `/user/alumni/${alumni.user_name}/contact` },
        { text: 'Employment', href: `/user/alumni/${alumni.user_name}/employment` },
    ];
    const profileImageUrl =
        alumni.personal_details?.photo ||
        alumni.avatar ||
        '/assets/images/default-profile.png';

    const quickFacts = [
        {
            label: 'Education',
            value: alumni.academic_details?.school_level,
            icon: <GraduationCap className="size-4" />,
        },
        {
            label: 'Current work',
            value: alumni.employment_details?.current_work_company,
            icon: <BriefcaseBusiness className="size-4" />,
        },
    ].filter((item) => item.value);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.origin + resolvedPublicProfileUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    return (
        <div className='m-4 overflow-hidden rounded-lg'>
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm !h-[calc(100vh-112px)] !max-h-[calc(100vh-112px)] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400">
                <div className="h-70 bg-slate-200 max-w-5xl mt-5 rounded-lg mx-auto" />

                <div className="mx-auto max-w-5xl px-6 pb-8">
                    <div className="-mt-14 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-end">
                            <div className="rounded-full border-4 border-white bg-white shadow-lg">
                                <img
                                    className="h-42 w-42 rounded-full object-cover"
                                    src={profileImageUrl}
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
                                {actions ?? (
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={handleCopy}>
                                            <Copy className="size-4" />
                                            {copied ? 'Copied' : 'Copy public link'}
                                        </Button>
                                        <Button asChild>
                                            <Link href={resolvedPublicProfileUrl}>
                                                <ExternalLink className="size-4" />
                                                View public profile
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-100 pt-3">
                        <div className="flex flex-wrap gap-2 mb-5">
                            {resolvedTabs.map((tab) => (
                                <Link
                                    key={tab.text}
                                    href={tab.href}
                                    as="div"
                                >
                                    <Button variant={urlIsActive(tab.href) ? 'default' : 'ghost'}>
                                        {tab.text}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
}
