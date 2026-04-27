import axios from 'axios';
import { router, usePage } from '@inertiajs/react';
import { Ban, Check, Plus, Search, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { bulk_approve, bulk_delete, bulk_reject, index, show } from '@/routes/post';
import { OperationSignals, Pagination, PostRow } from '@/types';

import BulkSelectionToolbar from './bulk-selection-toolbar';
import { useConfirmAction } from './context/confirm-action-context';
import JobPostModal from './post-create-modal';
import PostCards from './post-cards';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Filter = { property: string; value: string };

const getPost = async (post_id: number): Promise<PostRow> => {
    const response = await axios.get<PostRow>(show(post_id).url);

    return response.data;
};

export default function PostList() {
    const { props } = usePage<{ posts: Pagination<PostRow[]>; signals?: OperationSignals }>();

    const [posts, setPosts] = useState<PostRow[]>(props.posts.data);
    const [searchInput, setSearchInput] = useState('');
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const [openCreate, setOpenCreate] = useState(false);

    const params = new URLSearchParams(window.location.search);
    const initialFilters: Filter[] = Array.from(params.entries()).map(([property, value]) => ({ property, value }));
    const [filter, setFilter] = useState<Filter[]>(initialFilters);
    const [tableVersion, setTableVersion] = useState(0);

    const { confirmActionContentCreateModal } = useConfirmAction();

    useEffect(() => {
        setPosts(props.posts.data);
    }, [props.posts]);

    useEffect(() => {
        if (props.signals?.deselect) {
            setSelectedData([]);
        }
    }, [props.signals?.deselect]);

    const applyFilters = useCallback((nextFilters: Filter[]) => {
        sessionStorage.setItem('post_filters', JSON.stringify(nextFilters.filter((item) => item.property !== 'page')));

        const params = nextFilters.reduce((accumulator, current) => {
            accumulator[current.property] = current.value;
            return accumulator;
        }, {} as Record<string, string>);

        router.get(index().url, params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, []);

    const setOrRemoveParameters = (property: string, value?: string) => {
        const next = value === undefined || value === 'none'
            ? filter.filter((item) => item.property !== property)
            : [...filter.filter((item) => item.property !== property), { property, value }];

        const pageRemoved = next.filter((item) => item.property !== 'page');

        setFilter(next);
        applyFilters(pageRemoved);
    };

    const handlePrivacyChange = (value: string) => setOrRemoveParameters('privacy', value);
    const handleStatusChange = (value: string) => setOrRemoveParameters('status', value);
    const handleSearchInputChange = () => setOrRemoveParameters('search', searchInput || undefined);

    useEffect(() => {
        setTableVersion((version) => version + 1);
    }, [posts]);

    useEffect(() => {
        const channel = window.Echo.channel('posts');

        channel.listen('.PostsUpdated', (payload: { post_id: number }) => {
            getPost(payload.post_id)
                .then((response) => {
                    setPosts((previous) => previous.some((post) => post.post_id === response.post_id) ? previous : [response, ...previous]);
                })
                .catch((error) => console.error(error));
        });

        return () => {
            window.Echo.leave('posts');
        };
    }, []);

    return (
        <div className="m-4 relative bg-white shadow rounded-lg h-[100%] overflow-hidden">
            {openCreate && <JobPostModal setCreatePostModal={setOpenCreate} />}

            <div className="justify-between flex items-center py-3 rounded-t-lg mt-3 mb-3 px-5">
                <div className="flex items-center gap-2">
                    {selectedData.length > 0 ? (
                        <BulkSelectionToolbar
                            count={selectedData.length}
                            onClear={() => setSelectedData([])}
                            actions={[
                                {
                                    label: 'Approve',
                                    icon: Check,
                                    iconClassName: 'text-green-500',
                                    onClick: () => confirmActionContentCreateModal({
                                        url: bulk_approve(),
                                        message: 'Are you sure you want to approve these job posts?',
                                        action: 'Approve',
                                        data: { post_ids: selectedData },
                                    }),
                                },
                                {
                                    label: 'Reject',
                                    icon: Ban,
                                    iconClassName: 'text-orange-500',
                                    onClick: () => confirmActionContentCreateModal({
                                        url: bulk_reject(),
                                        message: 'Are you sure you want to reject these job posts?',
                                        action: 'Reject',
                                        data: { post_ids: selectedData },
                                    }),
                                },
                                {
                                    label: 'Delete',
                                    icon: Trash,
                                    className: 'text-red',
                                    onClick: () => confirmActionContentCreateModal({
                                        url: bulk_delete(),
                                        message: 'Are you sure you want to delete these job posts?',
                                        action: 'Delete',
                                        data: { post_ids: selectedData },
                                        promptPassword: true,
                                    }),
                                },
                            ]}
                        />
                    ) : (
                        <div className="flex gap-2">
                            <Input
                                startIcon={<Search size={18} color="gray" />}
                                type="text"
                                placeholder="Search posts"
                                onChange={(event) => setSearchInput(event.target.value)}
                                onEndIconClick={handleSearchInputChange}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        handleSearchInputChange();
                                    }
                                }}
                                className="w-45 shadow-none focus-within:ring-0"
                            />

                            <div className="flex items-center gap-2">
                                <Select defaultValue={filter.find((item) => item.property === 'privacy')?.value || ''} onValueChange={handlePrivacyChange}>
                                    <SelectTrigger className="text-black gap-2 !text-black text-nowrap">
                                        <SelectValue placeholder="Privacy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filter.find((item) => item.property === 'privacy')?.value ? (
                                            <SelectItem value="none" className="text-red">Reset</SelectItem>
                                        ) : (
                                            <SelectItem value="none" className="hidden">Privacy</SelectItem>
                                        )}
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="friends">Friends</SelectItem>
                                        <SelectItem value="only_me">Only me</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select defaultValue={filter.find((item) => item.property === 'status')?.value || ''} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="text-black gap-2 !text-black text-nowrap">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filter.find((item) => item.property === 'status')?.value ? (
                                            <SelectItem value="none" className="text-red focus:text-red">Reset</SelectItem>
                                        ) : (
                                            <SelectItem value="none" className="hidden">Status</SelectItem>
                                        )}
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    <Button onClick={() => setOpenCreate(true)}>
                        <Plus className="size-4" />
                        Add Job Posting
                    </Button>
                </div>
            </div>

            {posts.length > 0 && (
                <PostCards key={tableVersion} posts={posts} selectedData={selectedData} setSelectedData={setSelectedData} />
            )}
        </div>
    );
}
