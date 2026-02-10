
import { Button } from "./ui/button";
import { Share2, MessageCircle, Heart, Link as LinkIcon, Globe, Ellipsis } from "lucide-react";
import { CompletePost } from "@/types";
import { getRelativeTimeDifference } from "@/helper";
import axios from "axios";
import { Link } from "@inertiajs/react";
import PostActionReaction from "./post-action-reaction";
import { useState } from "react";
import PostActionComment from "./post-action-comment";



interface PostItemProps {
    post: CompletePost;
    hasActions?: boolean
}

export default function PostItem({ post, hasActions = true }: PostItemProps) {

    const [reactionCount, setReactionCount] = useState(post.reactions_count);
    const [likedByUser, setLikedByUser] = useState(post.liked_by_user);

    return (
        <div className="flex flex-col">
            <div className="p-3 pb-0">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="border rounded-full z-10">
                            <img className="h-10 w-10 rounded-full border-3 border-white" src="/assets/images/default-profile.png" alt="My Image" />
                        </div>
                        <div>
                            <div className="font-semibold">{post.author.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                <Globe size={12} />
                                <span>•</span>
                                {getRelativeTimeDifference(post.created_at)}
                            </div>
                        </div>
                    </div>

                    <div className="p-1">
                        <Ellipsis size={22} />
                    </div>

                </div>
            </div>

            <div>
                <div className="p-4 pt-3">
                    <div className="prose max-w-none text-sm break-words mb-2">
                        {post.content}
                    </div>

                    {post.attachments && post.attachments.length > 0 && (
                        <div className="grid grid-cols-1 gap-3">
                            {post.attachments.map(att => (
                                att.type === "image" ? (
                                    <img key={att.attachment_id} src={att.url} alt="attachment" className="w-full h-[45vh] rounded-md object-cover" />
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
                                <span>{reactionCount}</span>
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

                    {
                        hasActions &&
                        <div className="flex gap-2">

                            <PostActionReaction post_id={post.post_id} likedByUser={likedByUser} setLikedByUser={setLikedByUser}  setReactionCount={setReactionCount} />

                            <PostActionComment  post_id={post.post_id}/>

                            <Button variant="ghost" className="flex-1 hover:bg-muted" onClick={() => { }}>
                                <Share2 className="size-4" /> Share
                            </Button>
                        </div>
                    }

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
        </div>
    );
}
