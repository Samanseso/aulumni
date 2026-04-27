import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash, Link as LinkIcon, ChevronsUpDown, Check, Ban, Globe, Send, SendHorizonal, FileText, X } from "lucide-react";
import { Form, usePage } from "@inertiajs/react";
import { Comment, CompletePost, User } from "@/types";
import { useConfirmAction } from "./context/confirm-action-context";
import axios from "axios";
import StatusTag from "./status-tag";
import { cn } from "@/lib/utils";
import PostItem from "./post-item";
import { destroy, show } from "@/routes/post";
import PostController from "@/actions/App/Http/Controllers/PostController";
import { Spinner } from "./ui/spinner";
import { Skeleton } from "./ui/skeleton";
import UserAvatar from "./user-avatar";
import { Input } from "./ui/input";
import { store } from "@/routes/comment";
import Comments from "./comments";


interface PostModalProps {
    post_id: number;
    setViewPostId: (id: number | null) => void;
    admin?: boolean;
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

const doComment = async (post_id: number, user_id: number, parent_comment_id: number | null, content: string): Promise<Comment> => {
    try {
        const response = await axios.post(store().url, { post_id, user_id, parent_comment_id, content });
        return response.data;
    } catch (err) {
        console.error("Failed to submit comment:", err);
        throw err;
    }
};

export default function PostModal({ post_id, setViewPostId, admin = false }: PostModalProps) {

    const { auth } = usePage<{ auth: { user: User } }>().props;

    const [post, setPost] = useState<CompletePost | null>(null);
    const [hovering, setHovering] = useState(true);

    const [comments, setComments] = useState<Comment[]>([])
    const [commentContent, setCommentContent] = useState("");

    const [returnedCommentId, setReturnedCommentId] = useState<number | null>(null);

    const { confirmActionContentCreateModal } = useConfirmAction();


    useEffect(() => {
        if (returnedCommentId) {
            const newComment = comments.find(item => item.comment_id === 0);

            if (!newComment) return;

            const updatedCommentId = { ...newComment, comment_id: returnedCommentId }


            setComments(prev => prev.map(item => item.comment_id === 0 ? updatedCommentId : item))
        }

        
    }, [returnedCommentId]);

    const handleComment = async (post_id: number, user_id: number, parent_comment_id: number | null, content: string) => {

        setCommentContent("");

        const newComment: Comment = {
            comment_id: 0,
            post_id: post_id,
            user_id: user_id,
            parent_comment_id: null,
            author: auth.user,
            content: content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        setComments(prev => [newComment, ...prev]);

        doComment(post_id, user_id, parent_comment_id, content)
        .then(res => {
            setReturnedCommentId(res.comment_id);
        })
    }

    useEffect(() => {
        getPost(post_id)
            .then(res => {
                setPost(res);
                setComments(res.comments);
            })
            .catch(err => console.log(err))
    }, [post_id]);




    return (
        <Dialog open={true} onOpenChange={() => setViewPostId(null)}>
            <DialogTitle className="hidden">Post</DialogTitle>  
            <DialogContent hasCloseButton={false} className="p-0 gap-0 bg-white lg:max-w-[45vw] h-fit">
                <DialogDescription className="hidden" />
                {
                    post ?
                        <>
                            <div className="px-5.5 py-4 flex items-center justify-between border-b" >
                                <p className="text-lg font-bold">{post.author.name}'s Post</p>
                                {admin && <StatusTag text={post.status} />}
                                <Button variant="secondary" size="icon" className="rounded-full"
                                    onClick={() => setViewPostId(null)}
                                >
                                    <X />   
                                </Button>
                            </div>
                            <div className={cn(
                                "ps-1.5 h-[72vh] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5",
                                "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded",
                                hovering ? "[&::-webkit-scrollbar-thumb]:bg-gray-300" : "[&::-webkit-scrollbar-thumb]:bg-transparent"
                            )}
                                onMouseEnter={() => setHovering(true)}
                                onMouseLeave={() => setHovering(false)}
                            >
                                <PostItem post={post} hasActions={false} />

                                {
                                    comments.length > 0 ?
                                        <Comments comment={comments} setComments={setComments} auth={auth} />
                                        :
                                        <div className="px-6 py-12 text-center">
                                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                                <FileText className="size-5" />
                                            </div>
                                            <p className="mt-4 text-sm font-medium text-slate-900">No comments yet</p>
                                            <p className="mt-1 text-xs text-slate-500">Be the first to comment.</p>
                                        </div>

                                }
                            </div>



                            {
                                admin ?
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
                                                    <Form {...PostController.reject.form(post.post_id)} className="w-full"
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
                                                    <Form {...PostController.approve.form(post.post_id)} className="w-full"
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
                                    </DialogFooter> :

                                    <DialogFooter className="px-5.5 py-4 flex sm:justify-between h-fit flex-1 border-t">
                                        <Input
                                            autoFocus
                                            startIcon={<UserAvatar className="h-7 w-7 text-[10px]" avatar={auth.user.avatar} name={auth.user.name} />}
                                            type="text"
                                            placeholder="Write a comment..."
                                            className="rounded-full py-5 ps-2 pe-3 bg-slate-200"
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            onEndIconClick={() => {
                                                handleComment(post_id, auth.user.user_id, null, commentContent)
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key == "Enter") {
                                                    handleComment(post_id, auth.user.user_id, null, commentContent)
                                                }
                                            }}
                                            endIcon={<SendHorizonal className="size-4.5 mt-0.25 text-blue-500" />}
                                        />
                                    </DialogFooter>
                            }
                        </> :
                        <>
                            <div className="px-5.5 pt-3 flex items-center justify-between" >
                                <Skeleton className="h-7 w-30 mt-2" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <div className={cn(
                                "ps-1.5 h-[72vh] overflow-auto"
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



                            {
                                admin &&
                                <DialogFooter className="px-5.5 py-3 flex sm:justify-between h-fit flex-1">
                                    <Skeleton className="h-9 w-24" />

                                    <div className="flex gap-3">
                                        <Skeleton className="h-9 w-20" />
                                        <Skeleton className="h-9 w-30" />
                                    </div>
                                </DialogFooter>
                            }
                        </>
                }
            </DialogContent>
        </Dialog>
    );
}
