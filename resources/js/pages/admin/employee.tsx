import { Head, usePage } from '@inertiajs/react'
import type { BreadcrumbItem, Employee, Pagination } from '@/types'
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


const Employee = () => {

    const props = usePage<{ employee: Pagination<Employee[]>}>().props;
    console.log(props);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
        
            <EmployeeList />

        </AppLayout>
    )
}

export default Employee