import { useCallback, useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Download, Search, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { useModal } from "./context/modal-context";
import { Pagination, PostRow } from '@/types';
import PostCards from './post-cards';
import { index, show } from '@/routes/post';
import axios from 'axios';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";



type ColumnType = { name: string; db_name: string };
type Filter = { property: string; value: string };


const getPost = async (post_id: number): Promise<PostRow> => {
    try {
        console.log(post_id);
        const response = await axios.get<PostRow>(show(post_id).url);
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch post:", err);
        throw err;
    }
};


export default function PostList() {
    const { props } = usePage<{ posts: Pagination<PostRow[]> }>();

    const [posts, setPosts] = useState<PostRow[]>(props.posts.data);
    const [rowsInput, setRowsInput] = useState(props.posts.per_page?.toString() ?? '10');
    const [searchInput, setSearchInput] = useState('');
    const [selectedData, setSelectedData] = useState<number[]>([]);



    const params = new URLSearchParams(window.location.search);
    const initialFilters: Filter[] = Array.from(params.entries()).map(([property, value]) => ({ property, value }));
    const [filter, setFilter] = useState<Filter[]>(initialFilters);
    const [tableVersion, setTableVersion] = useState(0);

    const { createModal } = useModal();

    useEffect(() => {
        setPosts(props.posts.data);
    }, [props.posts]);

    const applyFilters = useCallback((nextFilters: Filter[]) => {
        sessionStorage.setItem('post_filters', JSON.stringify(nextFilters.filter(f => f.property !== 'page')));

        const params = nextFilters.reduce((acc, cur) => {
            acc[cur.property] = cur.value;
            return acc;
        }, {} as Record<string, string>);

        router.get(index().url, params, {
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
    const handleStatusChange = (val: string) => setOrRemoveParameters('status', val);
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

    useEffect(() => {
        const channel = window.Echo.channel("posts");

        channel.listen(".PostsUpdated", (post_id: number) => {

            getPost(post_id)
                .then(res => {
                    setPosts(prev => prev.some(p => p.post_id === res.post_id) ? prev : [res, ...prev]);
                })
                .catch(err => console.log(err));
        });

        return () => {
            window.Echo.leave("posts");
        };
    }, [])

    return (
        <div className="m-4 relative bg-white shadow rounded-lg h-[100%] overflow-hidden">
            <div className="justify-between flex items-center py-3 rounded-t-lg mt-3 mb-3 px-5">
                <div className="flex items-center gap-2">
                    {selectedData.length > 0 ?
                        <div className="flex items-center pe-2 bg-gray-100 rounded-full">
                            <div className="flex items-center me-2">
                                <Button variant="ghost" className="rounded-full hover:bg-gray-300" onClick={() => setSelectedData([])}>
                                    Clear
                                </Button>

                                <p className="text-sm text-muted-foreground">
                                    {selectedData.length} selected
                                </p>
                            </div>
                        </div> :
                        <div className='flex gap-2'>
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


                                <Select defaultValue={filter.find(f => f.property === "status")?.value || ""} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="text-black gap-2 !text-black text-nowrap">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            filter.find(f => f.property === "status")?.value ?
                                                <SelectItem value="none" className="text-red focus:text-red">Reset</SelectItem> :
                                                <SelectItem value="none" className="hidden">Status</SelectItem>
                                        }
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* <Input prefix='From' type='date' />
                        <Input prefix='To' type='date' /> */}
                            </div>
                        </div>
                    }

                </div>

                <div className="flex gap-2 items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-0 cursor-pointer" asChild>
                            <Button variant="ghost">More <ChevronDown size={18} /></Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" >
                            <DropdownMenuItem onClick={() => { }}>
                                <Download /> Export
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {posts.length > 0 && (
                <PostCards key={tableVersion} posts={posts} selectedData={selectedData} setSelectedData={setSelectedData} />
            )}
            
        </div >
    );
}
