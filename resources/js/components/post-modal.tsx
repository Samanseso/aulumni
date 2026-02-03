import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash, Share2, MessageCircle, Heart, Link as LinkIcon, ChevronsUpDown, Check, Ban } from "lucide-react";
import { Form, Link } from "@inertiajs/react";
import { Post, Attachment, Comment, Reaction } from "@/types";
import { useConfirmAction } from "./context/confirm-action-context";
import axios from "axios";
import { approve, reject, show } from "@/routes/post";
import StatusTag from "./status-tag";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { getRelativeTimeDifference } from "@/helper";
import { cn } from "@/lib/utils";

interface CompletePost extends Post {
    attachments: Attachment[];
    comments?: Comment[];
    reactions?: Reaction[];
    user: { user_id: number; name?: string; user_name?: string; email?: string };
};


interface PostModalProps {
    post_id: string;
    setViewPostId: (id: string | null) => void;
}

const getPost = async (post_id: string): Promise<CompletePost> => {
    try {
        const response = await axios.get<CompletePost>(show(post_id).url);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch post:", err);
        throw err;
    }
};


export default function PostModal({ post_id, setViewPostId }: PostModalProps) {

    const [post, setPost] = useState<CompletePost | null>(null);
    const [hovering, setHovering] = useState(false);

    const { confirmActionContentCreateModal } = useConfirmAction();

    useEffect(() => {
        getPost(post_id)
            .then(res => setPost(res))
            .catch(err => console.log(err))
    }, [post_id])

    return (
        <Dialog open={true} onOpenChange={() => setViewPostId(null)} modal={true}>
            <DialogTitle className="hidden">Post</DialogTitle>
            <DialogContent hasCloseButton={false} className="p-0 border-5 border-white bg-white lg:max-w-2xl h-fit">
                <DialogDescription className="hidden" />

                {
                    post &&
                    <div className="flex flex-col">
                        <div className="p-4 border-b">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="border rounded-full z-10">
                                        <img className="h-12 w-12 rounded-full border-3 border-white" src="/assets/images/default-profile.png" alt="My Image" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{post.user.name}</div>
                                        <div className="text-xs text-gray-500">@{post.user.user_name} &nbsp;&middot;&nbsp; {new Date(post.created_at).toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="">
                                    <div className="flex justify-between items-start">


                                        <div className="text-right">
                                            <StatusTag text={post.status} />
                                            <div className="text-sm text-gray-600 mt-1">{post.privacy}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "h-[65vh] overflow-auto scroll-area [&::-webkit-scrollbar]:w-2",
                            "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded",
                            hovering ? "[&::-webkit-scrollbar-thumb]:bg-gray-300" : "[&::-webkit-scrollbar-thumb]:bg-transparent"
                        )}


                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}


                        >
                            <div className="p-4 pe-2">
                                <div className="prose max-w-none text-sm break-words mb-4">
                                    {post.content}
                                </div>

                                {post.attachments && post.attachments.length > 0 && (
                                    <div className="grid grid-cols-1 gap-3">
                                        {post.attachments.map(att => (
                                            att.type === "image" ? (
                                                <img key={att.attachment_id} src={att.url} alt="attachment" className="w-full h-[35vh] rounded-md object-cover" />
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

                            <div className="px-4 pb-4">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <Heart className="size-4 text-rose-500" />
                                            <span>{post.reactions_count}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="size-4 text-gray-600" />
                                            <span>{post.comments_count}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Share2 className="size-4 text-gray-600" />
                                            <span>{/* shares count if available */}</span>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-400">
                                        {`Updated ${new Date(post.updated_at).toLocaleString()}`}
                                    </div>
                                </div>

                                {/* <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => {}}>
                                        <Heart className="size-4" /> Like
                                    </Button>

                                    <Button variant="outline" onClick={() => {}}>
                                        <MessageCircle className="size-4" /> Comment
                                    </Button>

                                    <Button variant="outline" onClick={() => {}}>
                                        <Share2 className="size-4" /> Share
                                    </Button>
                                </div> */}
                            </div>

                            <div className="px-4 pb-4">
                                <div className="text-sm font-semibold mb-2">Comments</div>
                                <div className="space-y-3 max-h-56 overflow-auto pr-2">
                                    {post.comments && post.comments.length > 0 ? (
                                        post.comments.map(c => {
                                            const time = getRelativeTimeDifference(c.created_at)
                                            return (
                                                <div key={c.comment_id} className="flex gap-3 items-start">
                                                    <img src="/assets/images/default-profile.png" alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                                                    <div>
                                                        <div className="bg-muted py-2 px-3 mb-1 w-fit rounded-lg">
                                                            <div className="text-sm">{c.user.name}</div>
                                                            <div className="text-sm">{c.content}</div>
                                                        </div>
                                                        <div className="text-xs text-gray-400 ms-3">{time}</div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="text-xs text-gray-400">No comments yet</div>
                                    )}
                                </div>

                            </div>

                        </div>

                        <DialogFooter className="p-3 flex sm:justify-between h-fit flex-1">
                            <Button variant="destructive" type="button" onClick={() => confirmActionContentCreateModal({
                                url: "",
                                message: "Are you sure you want to delete this post?",
                                action: "Delete",
                            })}>
                                <Trash /> Delete Post
                            </Button>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setViewPostId(null)}>Close</Button>
                                <DropdownMenu >
                                    <DropdownMenuTrigger asChild>
                                        <Button>Update status <ChevronsUpDown /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top">
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
                        </DialogFooter>
                    </div>

                }
            </DialogContent>
        </Dialog>
    );
}
