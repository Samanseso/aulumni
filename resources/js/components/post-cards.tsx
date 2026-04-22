import { getRelativeTimeDifference } from '@/helper';
import { GroupedPost, PostRow } from '@/types';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "./ui/dropdown-menu";
import { Ban, Check, Ellipsis, EllipsisVertical, Eye, Globe, LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from '@inertiajs/react';
import { approve, reject } from '@/routes/post';
import { SetStateAction, useState } from 'react';
import PostModal from './post-modal';
import StatusTag from './status-tag';
import { Checkbox } from './ui/checkbox';

interface PostCardsProps {
    posts: PostRow[];
    selectedData: number[];
    setSelectedData: React.Dispatch<SetStateAction<number[]>>;
}

const PostCards = ({ posts, selectedData, setSelectedData }: PostCardsProps) => {
    const [viewPostId, setViewPostId] = useState<number | null>(null);

    const [groupedPosts, setGroupedPosts] = useState<GroupedPost>(() => {
        const groups: { [key: string]: PostRow[] } = {};
        posts.forEach(post => {
            const date = new Date(post.created_at).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(post);
        });
        return groups;
    });

    return (
        <div className="!h-[calc(100vh-196px)] !max-h-[calc(100vh-196px)] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400">
            {viewPostId !== null && (
                <PostModal post_id={viewPostId} setViewPostId={setViewPostId} />
            )}
            {Object.entries(groupedPosts).map(([key, grouped_post]) => (
                <div key={key} className="col-span-4">
                    <table className='w-full mb-3 table-fixed'>
                        <thead>
                            <tr className=''>
                                <th className="ps-5.25 pt-4 text-left text-sm text-gray-500 font-normal uppercase">
                                    {key}
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <div className="px-5 grid grid-cols-3 xl:grid-cols-4 gap-3 mb-7">
                        {grouped_post.map((post) => (
                            <div
                                onClick={(e) => {
                                    if ((e.target as HTMLElement).tagName.toLowerCase() === "button" || (e.target as HTMLElement).closest("button")) {
                                        return;
                                    }
                                    setViewPostId(post.post_id);
                                }}
                                key={post.post_uuid}
                                className="cursor-pointer flex items-start gap-3 p-3 bg-white border rounded-md shadow-sm hover:shadow-md transition">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                        <div className='flex items-center gap-2'>
                                            <div>
                                                <div className="border rounded-full z-10">
                                                    <img className="h-8 w-8 rounded-full border-3 border-white" src="/assets/images/default-profile.png" alt="My Image" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>{post.author.name}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="hidden sm:inline"><Globe size={12} /></span>
                                            </div>
                                        </div>

                                        <Checkbox className='size-5 cursor-pointer'
                                            checked={selectedData.includes(post.post_id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedData([...selectedData, post.post_id]);
                                                } else {
                                                    setSelectedData(selectedData.filter(id => id !== post.post_id));
                                                }
                                            }} />

                                        {/* <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant="ghost">
                                                    <EllipsisVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setViewPostId(post.post_id)}>
                                                    <Eye className="size-4 text-gray-700" /> View
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link className="w-full" href={approve(post.post_id)}>
                                                        <Check className="size-4 text-green-500" /> Approve
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link className="w-full" href={reject(post.post_id)} as="div">
                                                        <Ban className="size-4 text-rose-500" /> Reject
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu> */}
                                    </div>

                                    <div className="mb-3">
                                        <h4 className="text-sm text-gray-900 line-clamp-2 my-3">
                                            {post.job_title}
                                        </h4>
                                        {post.attachments && post.attachments.length > 0 ?
                                            <div className="grid grid-cols-1 gap-3">
                                                {post.attachments.map(att => (
                                                    att.type === "image" ? (
                                                        <img key={att.attachment_id} src={att.url} alt="attachment" className="w-full h-[25vh] rounded-md object-cover" />
                                                    ) : (
                                                        <div key={att.attachment_id} className="flex items-center gap-2 p-3 border rounded-md">
                                                            <LinkIcon className="size-5" />
                                                            <a href={att.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 truncate">{att.url}</a>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                            :
                                            <div className="flex h-[25vh] items-center justify-center rounded-md bg-gradient-to-br from-blue/10  to-white">
                                                <p className="px-4 text-center text-sm font-medium text-slate-500">No attachement uploaded</p>
                                            </div>}
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <p className='text-xs text-gray-500'>{getRelativeTimeDifference(post.created_at)}</p>
                                        <StatusTag text={post.status} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </div>
    );

}

export default PostCards