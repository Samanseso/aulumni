import { Head } from '@inertiajs/react'
import type { BreadcrumbItem } from '@/types'
import AppLayout from '@/layouts/app-layout';
import EmployeeList from '@/components/employee-list';
import { index } from '@/routes/employee';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '',
    },
    {
        title: 'Employee',
        href: index().url,
    },

];


const Employees = () => {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <EmployeeList />
        </AppLayout>
    )
}

export default Employees