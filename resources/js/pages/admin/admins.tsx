import { Head, usePage } from '@inertiajs/react'
import type { BreadcrumbItem, Employee, ModalType, Pagination } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/admin';
import AdminList from '@/components/admin-list';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '',
    },
    {
        title: 'Admin',
        href: index().url,
    },

];


const Admins = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <AdminList />
        </AppLayout>
    )
}

export default Admins