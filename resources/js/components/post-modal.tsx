import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash, Link as LinkIcon, ChevronsUpDown, Check, Ban, Globe } from "lucide-react";
import { Form } from "@inertiajs/react";
import { CompletePost } from "@/types";
import { useConfirmAction } from "./context/confirm-action-context";
import axios from "axios";
import StatusTag from "./status-tag";
import { cn } from "@/lib/utils";
import PostItem from "./post-item";
import { destroy, show } from "@/routes/post";
import PostController from "@/actions/App/Http/Controllers/PostController";
import { Spinner } from "./ui/spinner";
import { Skeleton } from "./ui/skeleton";


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
                    post ?
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
                                    url: destroy(post.post_id),
                                    message: "Are you sure you want to delete this post?",
                                    action: "Delete",
                                })}>
                                    <Trash /> Delete Post
                                </Button>

                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setViewPostId(null)}>Close</Button>
                                    {
                                        post.status === "approved" ?
                                            <Form {...PostController.reject(post.post_id)} className="w-full"
                                                onSuccess={() => setViewPostId(null)}
                                            >
                                                {({ processing }) => (
                                                    <Button disabled={processing} variant="destructive">
                                                        {processing ? <Spinner /> : <Ban className="size-4 text-rose-500" />}
                                                        Reject
                                                    </Button>

                                                )}
                                            </Form>
                                            :
                                            <Form {...PostController.approve(post.post_id)} className="w-full"
                                                onSuccess={() => setViewPostId(null)}
                                            >
                                                {({ processing }) => (
                                                    <Button disabled={processing} variant="success">
                                                        {processing ? <Spinner /> : <Check className="size-4 text-green-500" />}
                                                        Approve
                                                    </Button>
                                                )}
                                            </Form>
                                    }
                                </div>
                            </DialogFooter>
                        </> :
                        <>
                            <div className="px-5.5 pt-3 flex items-center justify-between" >
                                <Skeleton className="h-7 w-30 mt-2" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <div className={cn(
                                "ps-1.5 h-[65vh] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5",
                                "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded",
                                hovering ? "[&::-webkit-scrollbar-thumb]:bg-gray-300" : "[&::-webkit-scrollbar-thumb]:bg-transparent"
                            )}
                            >

                                <div className="ps-3 flex gap-2 mt-1.75">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1">
                                        <Skeleton className="h-10 w-60 mb-2" />
                                    </div>
                                </div>
                                <div className="mt-2 ps-4 pe-4.5">
                                    <Skeleton className="h-20 w-full mb-3" />
                                    <Skeleton className="h-80 w-full" />
                                    
                                </div>


                            </div>



                            <DialogFooter className="px-5.5 py-3 flex sm:justify-between h-fit flex-1">
                                <Skeleton className="h-9 w-24" />

                                <div className="flex gap-3">
                                    <Skeleton className="h-9 w-20" />
                                    <Skeleton className="h-9 w-30" />
                                </div>
                            </DialogFooter>
                        </>
                }
            </DialogContent>
        </Dialog>
    );
}
