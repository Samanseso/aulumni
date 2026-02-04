import { getRelativeTimeDifference } from '@/helper';
import { PostRow } from '@/types';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "./ui/dropdown-menu";
import { Ban, Check, Ellipsis, EllipsisVertical, Eye, Globe, LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from '@inertiajs/react';
import { approve, reject } from '@/routes/post';
import { SetStateAction, useState } from 'react';
import PostModal from './post-modal';
import StatusTag from './status-tag';

interface PostCardsProps {
    posts: PostRow[];
}

const PostCards = ({ posts }: PostCardsProps) => {
    const [viewPostId, setViewPostId] = useState<string | null>(null);

    return (
        <div className="px-5 grid grid-flow-col grid-cols-4 gap-3">
            {viewPostId !== null && (
                <PostModal post_id={viewPostId} setViewPostId={setViewPostId} />
            )}
            {posts.map((post) => (
                <div key={post.post_uuid} className="flex items-start gap-3 p-3 bg-white border rounded-md shadow-sm hover:shadow-md transition">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <div className="border rounded-full z-10">
                                        <img className="h-8 w-8 rounded-full border-3 border-white" src="/assets/images/default-profile.png" alt="My Image" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>{post.user.name}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline"><Globe size={12} /></span>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost">
                                        <EllipsisVertical className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setViewPostId(post.post_uuid)}>
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
                            </DropdownMenu>
                        </div>

                        <div className="mb-3">
                            <h4 className="text-sm text-gray-900 line-clamp-2 mb-2">
                                {post.content}
                            </h4>
                            {post.attachments && post.attachments.length > 0 && (
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
                            )}
                        </div>

                        <div className='flex items-center justify-between'>
                            <p className='text-xs text-gray-500'>{getRelativeTimeDifference(post.created_at)}</p>
                            <StatusTag text={post.status} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default PostCards