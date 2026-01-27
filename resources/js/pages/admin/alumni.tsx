import { Head, usePage } from '@inertiajs/react'
import type { Alumni, BreadcrumbItem, ModalType, Pagination } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/alumni';
import SearchBar from '@/components/search-bar';
import AlumniList from '@/components/alumni-list';
import { Modal } from '@/components/modal';
import { useConfirmAction } from '@/components/context/confirm-action-context';
import ActionConfirmation from '@/components/action-confirmation';
import { useState } from 'react';


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

    const props = usePage<{ alumni: Pagination<Alumni[]>}>().props;
    console.log(props);

    const { confimActionContent, setConfimActionContent } = useConfirmAction();

    console.log(confimActionContent);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
        
            <AlumniList />

            {confimActionContent && <ActionConfirmation url={confimActionContent.url} message={confimActionContent.message} data={confimActionContent.data} setConfimActionContent={setConfimActionContent}/>}



        </AppLayout>
    )
}

export default Alumni