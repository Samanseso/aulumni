import { PropsWithChildren, ReactNode } from 'react';

import { PublicProfileActions } from '@/components/alumni-profile-sections';
import AlumniProfileLayout from '@/layouts/alumni-profile-layout';
import AppLayout from '@/layouts/app-layout';
import { Alumni } from '@/types';
import { Head } from '@inertiajs/react';

interface PublicProfileShellProps extends PropsWithChildren {
    alumni: Alumni;
    isOwnProfile: boolean;
    title: string;
    actions?: ReactNode;
}

export default function PublicProfileShell({
    alumni,
    isOwnProfile,
    title,
    actions,
    children,
}: PublicProfileShellProps) {
    const publicProfileUrl = `/${alumni.user_name}`;
    const tabs = [
        { text: 'All', href: publicProfileUrl },        
        { text: 'Personal', href: `${publicProfileUrl}/personal` },
        { text: 'Academic', href: `${publicProfileUrl}/academic` },
        { text: 'Contact', href: `${publicProfileUrl}/contact` },
        { text: 'Employment', href: `${publicProfileUrl}/employment` },
    ];

    return (
        <AppLayout>
            <Head title={title} />

            <AlumniProfileLayout
                alumni={alumni}
                tabs={tabs}
                publicProfileUrl={publicProfileUrl}
                actions={actions ?? (
                    <PublicProfileActions
                        profileUrl={publicProfileUrl}
                        backUrl="/"
                        actionLabel={isOwnProfile ? 'Back to feed' : 'Open feed'}
                    />
                )}
                className='m-0 rounded-none !h-[100vh-65px] !max-h-[calc(100vh-65px)]'
            >
                {children}
            </AlumniProfileLayout>
        </AppLayout>
    );
}
