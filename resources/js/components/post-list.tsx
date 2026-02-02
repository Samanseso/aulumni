import { useCallback, useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Download, Upload, Plus, Search, ListFilter, BadgeCheck, Ban, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { TablePagination } from "./table-pagination";
import { useConfirmAction } from "./context/confirm-action-context";
import { useModal } from "./context/modal-context";
import SortCollapsible from "./sort-collapsible";
import { Import } from './import';
import { Pagination, PostRow } from '@/types';
import PostTable from './post-table';


type ColumnType = { name: string; db_name: string };
type Filter = { property: string; value: string };


export default function PostList() {
    const { props } = usePage<{ posts: Pagination<PostRow[]>}>();
    
    const columns = [
        'Post ID',
        'Author',
        'Content',
        'Privacy',
        'Reactions',
        'Comments',
        'Status',
    ];

    const sortableColumns: ColumnType[] = [
        { name: 'Post ID', db_name: 'post_id' },
        { name: 'Author', db_name: 'user_id' },
        { name: 'Created At', db_name: 'created_at' },
    ];

    const [posts, setPosts] = useState<PostRow[]>(props.posts.data);
    const [rowsInput, setRowsInput] = useState(props.posts.per_page?.toString() ?? '10');
    const [searchInput, setSearchInput] = useState('');
    const [selectedData, setSelectedData] = useState<number[]>([]);

    const params = new URLSearchParams(window.location.search);
    const initialFilters: Filter[] = Array.from(params.entries()).map(([property, value]) => ({ property, value }));
    const [filter, setFilter] = useState<Filter[]>(initialFilters);
    const [tableVersion, setTableVersion] = useState(0);
    const [open, setOpen] = useState(false);

    const { confirmActionContentCreateModal } = useConfirmAction();
    const { createModal } = useModal();

    useEffect(() => {
        setOpen(false);
        setPosts(props.posts.data);
    }, [props.posts]);

    const applyFilters = useCallback((nextFilters: Filter[]) => {
        sessionStorage.setItem('post_filters', JSON.stringify(nextFilters.filter(f => f.property !== 'page')));

        const params = nextFilters.reduce((acc, cur) => {
            acc[cur.property] = cur.value;
            return acc;
        }, {} as Record<string, string>);

        router.get('/posts', params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, []);

    const setOrRemoveParameters = (property: string, value?: string) => {
        const next = value === undefined || value === 'none'
            ? filter.filter(f => f.property !== property)
            : [...filter.filter(f => f.property !== property), { property, value }];

        const pageRemoved = next.filter(f => f.property !== 'page');

        setFilter(next);
        applyFilters(pageRemoved);
    };

    // handlers
    const handlePrivacyChange = (val: string) => setOrRemoveParameters('privacy', val);
    const handleAuthorChange = (val: string) => setOrRemoveParameters('user_id', val);
    const handleSearchInputChange = () => setOrRemoveParameters('search', searchInput || undefined);
    const handleRowsInputChange = () => {
        const n = parseInt(rowsInput);
        if (Number.isNaN(n) || n < 1 || n > 200) {
            createModal({
                status: 'error',
                action: 'get',
                title: 'Invalid Rows',
                message: 'Rows should be from 1 - 200 only',
            });
            return;
        }
        setOrRemoveParameters('rows', n.toString());
    };

    useEffect(() => {
        setTableVersion(v => v + 1);
    }, [posts]);

    return (
        <div className="m-4 relative bg-white shadow rounded-lg h-[100%] overflow-hidden">
            <div className="flex p-5 pb-2 justify-between">
                <p className="font-bold text-xl text-gray-600">List of Posts</p>
                <div className="flex gap-2">
                    <Button variant="outline" className="hidden md:flex"><Download />Export</Button>
                    <Button variant="outline" className="hidden md:flex" onClick={() => setOpen(true)}>
                        <Upload />Import
                    </Button>

                    <Link href="/posts/create">
                        <Button><Plus />Create Post</Button>
                    </Link>
                </div>
            </div>

            <div className="justify-between flex items-center py-3 px-0 rounded-t-lg mb-6 px-5">
                <div className="flex items-center gap-2">
                    <ListFilter size={15} />
                    <div className="flex items-center gap-2">
                        <Select defaultValue={filter.find(f => f.property === 'privacy')?.value || ''} onValueChange={handlePrivacyChange}>
                            <SelectTrigger className="text-black gap-2 !text-black text-nowrap">
                                <SelectValue placeholder="Privacy" />
                            </SelectTrigger>
                            <SelectContent>
                                {filter.find(f => f.property === 'privacy')?.value ? (
                                    <SelectItem value="none" className="text-red">Reset</SelectItem>
                                ) : (
                                    <SelectItem value="none" className="hidden">Privacy</SelectItem>
                                )}
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="friends">Friends</SelectItem>
                                <SelectItem value="only_me">Only me</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select defaultValue={filter.find(f => f.property === 'user_id')?.value || ''} onValueChange={handleAuthorChange}>
                            <SelectTrigger className="text-black gap-2 !text-black">
                                <SelectValue placeholder="Author" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* {filter.find(f => f.property === 'user_id')?.value ? (
                                    <SelectItem value="none" className="text-red">Reset</SelectItem>
                                ) : (
                                    <SelectItem value="none" className="hidden">Author</SelectItem>
                                )}
                                {props.users.map(user => (
                                    <SelectItem key={user.user_id} value={String(user.user_id)}>{user.name}</SelectItem>
                                ))} */}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    {/* <SortCollapsible columns={sortableColumns} setOrRemoveParameters={setOrRemoveParameters} /> */}

                    <Input
                        prefix="Show"
                        suffix="rows"
                        id="rows"
                        type="number"
                        className="w-32 gap-2"
                        defaultValue={props.posts.per_page}
                        onChange={(e) => setRowsInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleRowsInputChange();
                            }
                        }}
                    />

                    <Input
                        endIcon={<Search size={20} color="gray" />}
                        type="text"
                        placeholder="Search posts"
                        onChange={e => setSearchInput(e.target.value)}
                        onEndIconClick={handleSearchInputChange}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchInputChange();
                            }
                        }}
                        className="w-45 shadow-none focus-within:ring-0"
                    />
                </div>
            </div>

            {posts.length > 0 && (
                <PostTable
                    key={tableVersion}
                    posts={posts}
                    columns={columns}
                    selectedData={selectedData}
                    setSelectedData={setSelectedData}
                />
            )}

            <Import open={open} table="posts" setOpen={setOpen} />
            <div className="flex w-full justify-between items-end px-6 absolute bottom-7 right-0 space-x-10">
                {
                    props.posts.data.length > 0 &&
                    <p className="text-sm">{`Showing
                        ${props.posts.from} to ${props.posts.to} out of
                        ${props.posts.total} entries`}
                    </p>
                }


                <div>
                    {
                        selectedData.length > 0 &&
                        <div className="flex items-end gap-3">
                            <p className="text-sm">With {selectedData.length} selected:</p>
                            <div className="flex gap-3">

                                <Button size="sm" className="translate-y-1.5" variant="outline" onClick={() => confirmActionContentCreateModal({
                                    url: "",
                                    message: "Are you sure you want to activate this accounts",
                                    action: "Activate",
                                    data: { user_ids: selectedData }

                                })}>
                                    <BadgeCheck className="text-green-500" />Activate
                                </Button>

                                <Button size="sm" className="translate-y-1.5" variant="outline" onClick={() => confirmActionContentCreateModal({
                                    url: "",
                                    message: "Are you sure you want to deactivate this accounts",
                                    action: "Deactivate",
                                    data: { user_ids: selectedData }

                                })}>
                                    <Ban className="text-red-500" />Deactivate
                                </Button>

                                <Button size="sm" className="translate-y-1.5" variant="outline">
                                    <Upload />Export
                                </Button>

                                <Button size="sm" className="translate-y-1.5 bg-rose-100 text-red" onClick={() => confirmActionContentCreateModal({
                                    url: "",
                                    message: "Are you sure you want to delete this accounts?",
                                    action: "Delete",
                                    data: { user_ids: selectedData },
                                    promptPassword: true,
                                })}>
                                    <Trash />Delete
                                </Button>
                            </div>

                        </div>
                    }
                </div>
                {props.posts.data.length > 0 && <TablePagination data={props.posts} />}
            </div>
        </div >
    );
}
