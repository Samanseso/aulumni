import AlumniProfileLayout from '@/layouts/alumni-profile-layout';
import AppLayout from '@/layouts/app-layout'
import { ContactDetailsCard, PersonalDetailsCard, ProfileSummaryCard } from '@/components/alumni-profile-sections';
import { Alumni, BreadcrumbItem } from '@/types';
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

const Personal = () => {
    const { props } = usePage<{ alumni: Alumni }>();

    
    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: props.alumni.name, href: '' }]}>
            <Head title="Alumni" />
            <AlumniProfileLayout alumni={props.alumni}>
                <div className="grid gap-5 lg:grid-cols-2">
                    <ProfileSummaryCard alumni={props.alumni} />
                    <PersonalDetailsCard alumni={props.alumni} />
                    <div className="lg:col-span-2">
                        <ContactDetailsCard alumni={props.alumni} />
                    </div>
                </div>
            </AlumniProfileLayout>

        </AppLayout>
    )
}

export default Personal
