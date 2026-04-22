import { PropsWithChildren } from 'react';

import { PublicProfileActions } from '@/components/alumni-profile-sections';
import AlumniProfileLayout from '@/layouts/alumni-profile-layout';
import AppLayout from '@/layouts/app-layout';
import { Alumni } from '@/types';
import { Head } from '@inertiajs/react';

interface PublicProfileShellProps extends PropsWithChildren {
    alumni: Alumni;
    isOwnProfile: boolean;
    title: string;
}

export default function PublicProfileShell({
    alumni,
    isOwnProfile,
    title,
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
                actions={
                    <PublicProfileActions
                        profileUrl={publicProfileUrl}
                        backUrl="/"
                        actionLabel={isOwnProfile ? 'Back to feed' : 'Open feed'}
                    />
                }
            >
                {children}
            </AlumniProfileLayout>
        </AppLayout>
    );
}
