import AlumniProfileLayout from '@/layouts/alumni-profile-layout';
import AppLayout from '@/layouts/app-layout'
import { AcademicDetailsCard, EmploymentDetailsCard, ProfileSummaryCard } from '@/components/alumni-profile-sections';
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

const Academic = () => {
    const { props } = usePage<{ alumni: Alumni }>();

    
    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: props.alumni.name, href: '' }]}>
            <Head title="Alumni" />
            <AlumniProfileLayout alumni={props.alumni}>
                <div className="grid gap-5 lg:grid-cols-2">
                    <ProfileSummaryCard alumni={props.alumni} />
                    <AcademicDetailsCard alumni={props.alumni} />
                    <div className="lg:col-span-2">
                        <EmploymentDetailsCard alumni={props.alumni} />
                    </div>
                </div>
            </AlumniProfileLayout>

        </AppLayout>
    )
}

export default Academic
