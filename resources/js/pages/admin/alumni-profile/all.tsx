import AlumniProfileLayout from '@/layouts/alumni-profile-layout';
import AppLayout from '@/layouts/app-layout'
import {
    ProfileSummaryCard,
    ProfileTimeline,
} from '@/components/alumni-profile-sections'
import { Alumni, BreadcrumbItem, CompletePost } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/user/alumni',
    },
    {
        title: 'Alumni',
        href: '/user/alumni',
    },

];

const All = () => {
    const { props } = usePage<{ alumni: Alumni, posts: CompletePost[] }>();

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: props.alumni.name, href: '' }]}>
            <Head title="Alumni" />
            <AlumniProfileLayout alumni={props.alumni}>
                <div className='grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]'>
                    <div className='grid gap-5'>
                        <ProfileSummaryCard alumni={props.alumni} />
                    </div>
                    <div className='grid gap-5'>
                        <ProfileTimeline
                            posts={props.posts}
                            emptyMessage="This alumni has not published any job opportunities yet."
                        />
                    </div>
                </div>
            </AlumniProfileLayout>
        </AppLayout>
    )
}

export default All
