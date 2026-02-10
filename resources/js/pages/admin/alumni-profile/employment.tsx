import AlumniProfileLayout from '@/layouts/alumni-profile-layout';
import AppLayout from '@/layouts/app-layout'
import { index } from '@/routes/alumni';
import { Alumni, BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '',
    },
    {
        title: 'Alumni',
        href: index().url,
    },

];

const Employment = () => {
    const { props } = usePage<{ alumni: Alumni }>();

    
    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: props.alumni.name, href: '' }]}>
            <Head title="Alumni" />
            <AlumniProfileLayout alumni={props.alumni}>
                Employment
            </AlumniProfileLayout>

        </AppLayout>
    )
}

export default Employment