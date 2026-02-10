import { Head } from '@inertiajs/react'
import type { BreadcrumbItem } from '@/types'
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <PostList />
        </AppLayout>
    )
}

export default Posts