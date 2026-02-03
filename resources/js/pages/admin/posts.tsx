import { Head, usePage } from '@inertiajs/react'
import type { BreadcrumbItem, ModalType, Pagination, Post } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/post';
import PostList from '@/components/post-list';
import { useEffect } from 'react';
import { useModal } from '@/components/context/modal-context';
import { useConfirmAction } from '@/components/context/confirm-action-context';
import { Modal } from '@/components/modal';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Content Management',
        href: '',
    },
    {
        title: 'Job Postings',
        href: index().url,
    },

];


const Posts = () => {

    const props = usePage<{ modal: ModalType }>().props;

    const { confirmActionContent, setConfirmActionContent: setConfimActionContent } = useConfirmAction();
    const { modalContent, setModalContent } = useModal();

    useEffect(() => {
        console.log(props);
        setModalContent(props.modal);
    }, [props.modal]);




    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />

            <PostList />

            {modalContent && modalContent.status && <Modal content={modalContent} setModalContent={setModalContent} />}
            

        </AppLayout>
    )
}

export default Posts