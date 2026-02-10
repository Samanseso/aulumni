import { Head } from '@inertiajs/react'
import type { Alumni, BreadcrumbItem, ModalType, Pagination } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/alumni';
import AlumniList from '@/components/alumni-list';


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


const Alumni = () => {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <AlumniList />

        </AppLayout>
    )
}

export default Alumni