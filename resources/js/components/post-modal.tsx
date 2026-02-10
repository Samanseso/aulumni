import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash, Share2, MessageCircle, Heart, Link as LinkIcon, ChevronsUpDown, Check, Ban, Globe } from "lucide-react";
import { Form, Link } from "@inertiajs/react";
import { Post, Attachment, Comment, Reaction, CompletePost } from "@/types";
import { useConfirmAction } from "./context/confirm-action-context";
import axios from "axios";
import { approve, reject } from "@/routes/post";
import StatusTag from "./status-tag";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { getRelativeTimeDifference } from "@/helper";
import { cn } from "@/lib/utils";
import PostItem from "./post-item";
import { show } from "@/routes/news-feed";


interface PostModalProps {
    post_id: number;
    setViewPostId: (id: number | null) => void;
}

const getPost = async (post: number): Promise<CompletePost> => {
    try {
        const response = await axios.get<CompletePost>(show(post).url);
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
    }, [post_id]);



    return (
        <Dialog open={true} onOpenChange={() => setViewPostId(null)} modal={true}>
            <DialogTitle className="hidden">Post</DialogTitle>
            <DialogContent hasCloseButton={false} className="p-0 border-5 border-white bg-white lg:max-w-2xl h-fit">
                <DialogDescription className="hidden" />
                {
                    post &&
                    <>
                        <div className="px-5.5 pt-3 flex items-center justify-between" >
                            <p className="text-lg font-bold">{post.author.name}'s Post</p>
                            <StatusTag text={post.status} />
                        </div>
                        <div className={cn(
                            "ps-1.5 h-[65vh] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5",
                            "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded",
                            hovering ? "[&::-webkit-scrollbar-thumb]:bg-gray-300" : "[&::-webkit-scrollbar-thumb]:bg-transparent"
                        )}
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}
                        >
                            <PostItem post={post} hasActions={false} />
                        </div>


                        <DialogFooter className="px-5.5 py-3 flex sm:justify-between h-fit flex-1">
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
                    </>
                }
            </DialogContent>
        </Dialog>
    );
}
