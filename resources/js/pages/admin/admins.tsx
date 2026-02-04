import { Head, usePage } from '@inertiajs/react'
import type { BreadcrumbItem, Employee, ModalType, Pagination } from '@/types'
import AppLayout from '@/layouts/app-layout';
import EmployeeList from '@/components/employee-list';
import { index } from '@/routes/admin';
import { useConfirmAction } from '@/components/context/confirm-action-context';
import ActionConfirmation from '@/components/action-confirmation';
import { useEffect } from 'react';
import { useModal } from '@/components/context/modal-context';
import { Modal } from '@/components/modal';
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

    const props = usePage<{ modal: ModalType }>().props;

    const { confirmActionContent, setConfirmActionContent: setConfimActionContent } = useConfirmAction();
    const { modalContent, setModalContent } = useModal();
    

    useEffect(() => {
        setModalContent(props.modal);
    }, [props.modal]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {
                confirmActionContent &&

                <ActionConfirmation
                    url={confirmActionContent.url}
                    message={confirmActionContent.message}
                    action={confirmActionContent.action}
                    data={confirmActionContent.data}
                    promptPassword={confirmActionContent.promptPassword}
                    setConfirmActionContent={setConfimActionContent}
                />
            }

            <AdminList />

            {modalContent && modalContent.status && <Modal content={modalContent} setModalContent={setModalContent} />}

        </AppLayout>
    )
}

export default Admins