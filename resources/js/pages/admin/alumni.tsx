import { Head, usePage } from '@inertiajs/react'
import type { Alumni, BreadcrumbItem, ModalType, Pagination } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/alumni';
import AlumniList from '@/components/alumni-list';
import { Modal } from '@/components/modal';
import { useConfirmAction } from '@/components/context/confirm-action-context';
import ActionConfirmation from '@/components/action-confirmation';
import { useEffect } from 'react';
import { useModal } from '@/components/context/modal-context';


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

    const props = usePage<{ modal: ModalType }>().props;    

    const { confirmActionContent, setConfirmActionContent: setConfimActionContent } = useConfirmAction();
    const { modalContent, setModalContent } = useModal();

    useEffect(() => {
        setModalContent(props.modal);
    }, [props.modal]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <AlumniList />

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

            {modalContent && modalContent.status && <Modal content={modalContent} setModalContent={setModalContent} />}

        </AppLayout>
    )
}

export default Alumni