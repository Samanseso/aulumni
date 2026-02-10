import { type ReactNode } from 'react';

import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';

import { Head, router, usePage } from '@inertiajs/react'
import type { Alumni, BreadcrumbItem, ModalType, Pagination } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/alumni';
import AlumniList from '@/components/alumni-list';
import { Modal } from '@/components/modal';
import { useConfirmAction } from '@/components/context/confirm-action-context';
import ActionConfirmation from '@/components/action-confirmation';
import { useEffect } from 'react';
import { useModal } from '@/components/context/modal-context';


interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const page_props = usePage<{ modal: ModalType }>().props;

    const { confirmActionContent, setConfirmActionContent: setConfimActionContent } = useConfirmAction();
    const { modalContent, setModalContent } = useModal();

    
    useEffect(() => {
        setModalContent(page_props.modal);
    }, [page_props.modal]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
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

            {children}
        </AppLayoutTemplate>
    )
};
