import { Head, usePage } from '@inertiajs/react'
import type { BreadcrumbItem, ModalType, Pagination, Post } from '@/types'
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/post';
import PostList from '@/components/post-list';


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

    const props = usePage<{ alumni: Pagination<Post[]>, modal: ModalType }>().props;    

    console.log(props);



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />

            <PostList />
            

        </AppLayout>
    )
}

export default Posts