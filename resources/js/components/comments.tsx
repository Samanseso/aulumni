import { Comment, User } from '@/types'
import UserAvatar from './user-avatar'
import { getRelativeTimeDifference } from '@/helper'
import { SetStateAction, useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Ellipsis, SendHorizonal } from 'lucide-react'
import axios from 'axios'
import { store } from '@/routes/comment'
import { Link, usePage } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import CommentActions from './comment-actions'
import { Button } from './ui/button'


interface CommentsProps {
    comment: Comment[] | undefined;
    setComments: React.Dispatch<SetStateAction<Comment[]>>;
    auth: { user: User };
}

const doReply = async (post_id: number, user_id: number, parent_comment_id: number, content: string) => {
    try {
        await axios.post(store().url, { post_id, user_id, parent_comment_id, content });
    } catch (err) {
        console.error("Failed to submit comment:", err);
        throw err;
    }
};

const Comments = ({ comment, setComments, auth }: CommentsProps) => {

    const [commentContent, setCommentContent] = useState("");
    const [isReplying, setIsReplying] = useState<{ replying: boolean, to: string, name: string } | null>(null);
    const [hoveringComment, setHoveringComment] = useState<number>(-1);
    const [activeComment, setActiveComment] = useState<number>(-1);


    const handleComment = async (post_id: number, user_id: number, parent_comment_id: number, content: string) => {

        setCommentContent("");
        setIsReplying(null)
        // increment reply count

        const newComment: Comment = {
            comment_id: 0,
            post_id: post_id,
            user_id: user_id,
            parent_comment_id: parent_comment_id,
            author: auth.user,
            content: content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        setComments(prev => [...prev, newComment]);

        doReply(post_id, user_id, parent_comment_id, content)
            .then(() => {

            })
            .catch((err) => {
                console.log(err)
            });
    }

    return (
        <div className='px-4 grid gap-3 pb-2'>
            {
                comment &&
                comment.map((c) => {
                    const replies = comment.filter(item => item.parent_comment_id === c.comment_id);

                    if (c.parent_comment_id !== null) {
                        return;
                    }

                    return (
                        <div key={c.comment_id} className="flex items-start gap-2">
                            <Link href={`/${c.author.user_name}`} className='mt-1'>
                                <UserAvatar className='h-8 w-8' avatar={c.author.avatar} name={c.author.name} />
                            </Link>
                            <div className='flex-1 me-4 grid gap-1'>
                                <div className='w-full flex items-center gap-3' onMouseEnter={() => setHoveringComment(c.comment_id)} onMouseLeave={() => setHoveringComment(-1)}>
                                    <div className='w-fit bg-gray-100 rounded-lg px-3 py-2'>
                                        <Link href={`/${c.author.user_name}`}><p className='text-sm font-semibold'>{c.author.name}</p></Link>
                                        <p>{c.content}</p>
                                    </div>


                                    {c.comment_id === hoveringComment && activeComment === -1 &&
                                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => {
                                            setActiveComment(c.comment_id);
                                            setHoveringComment(-1);
                                        }}>
                                            <Ellipsis />
                                        </Button>
                                    }
                                    {c.comment_id === activeComment && <CommentActions comment={c} setComments={setComments} setActiveComment={setActiveComment} user={auth.user} />}


                                </div>
                                <div className='flex gap-5 ps-3.25'>
                                    <p className='text-xs text-gray-500'>{getRelativeTimeDifference(c.created_at, true)}</p>
                                    <p
                                        className={cn("text-xs text-gray-500 cursor-pointer hover:underline")}
                                        onClick={() => setIsReplying({
                                            replying: true,
                                            to: c.comment_id.toString(),
                                            name: c.author.name
                                        })}>
                                        {c.comment_id !== 0 && "Reply"}
                                    </p>



                                </div>

                                {
                                    replies.length > 0 &&
                                    <div className='ms-3.5 grid gap-2 mt-2'>
                                        {
                                            replies.map(reply => (
                                                <div key={reply.comment_id} className="flex items-start gap-2">
                                                    <Link href={`/${reply.author.user_name}`} className='mt-1'>
                                                        <UserAvatar className='h-8 w-8' avatar={reply.author.avatar} name={reply.author.name} />
                                                    </Link>
                                                    <div className='flex-1 me-4 grid gap-1'>
                                                        <div className='w-fit bg-gray-100 rounded-lg px-3 py-2'>
                                                            <Link href={`/${reply.author.user_name}`}><p className='text-sm font-semibold'>{reply.author.name}</p></Link>
                                                            <p>{reply.content}</p>
                                                        </div>
                                                        <div className='flex gap-5 ps-3.25'>
                                                            <p className='text-xs text-gray-500'>{getRelativeTimeDifference(reply.created_at, true)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                }

                                {
                                    isReplying && isReplying.replying && c.comment_id.toString() === isReplying.to &&
                                    <Input
                                        autoFocus
                                        startIcon={<UserAvatar className="h-7 w-7" avatar={auth.user.avatar} name={auth.user.name} />}
                                        type="text"
                                        placeholder={`Replying to ${c.author.name}`}
                                        className="w-full rounded-full py-5 ps-2 pe-3 ms-3.5 mt-1 bg-slate-200"
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        onEndIconClick={() => {
                                            handleComment(c.post_id, auth.user.user_id, c.comment_id, commentContent)
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key == "Enter") {
                                                handleComment(c.post_id, auth.user.user_id, c.comment_id, commentContent)
                                            }
                                        }}
                                        endIcon={<SendHorizonal className="size-4.5 mt-0.25 text-blue-500" />}
                                    />
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Comments