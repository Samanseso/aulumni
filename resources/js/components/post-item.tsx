import { Heart, Link as LinkIcon, Globe, Ellipsis } from "lucide-react";
import { CompletePost } from "@/types";
import { getRelativeTimeDifference } from "@/helper";
import { Link } from "@inertiajs/react";
import PostActionReaction from "./post-action-reaction";
import { useState } from "react";

interface PostItemProps {
    post: CompletePost;
    hasActions?: boolean;
}

export default function PostItem({ post, hasActions = true }: PostItemProps) {
    const [reactionCount, setReactionCount] = useState<number>(post.reactions_count);
    const [likedByUser, setLikedByUser] = useState<boolean>(!!post.liked_by_user);

    return (
        <div className="flex flex-col bg-white rounded-md">
            {/* Header */}
            <div className="p-3 pb-0">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="border rounded-full z-10">
                            <img
                                className="h-10 w-10 rounded-full border-3 border-white"
                                src="/assets/images/default-profile.png"
                                alt="Profile"
                            />

                        </div>

                        <div>
                            <div className="font-semibold">
                                {/* link to author profile if available */}
                                {post.author?.user_id ? (
                                    <Link href={`/users/${post.author.user_id}`}>{post.author.name}</Link>
                                ) : (
                                    post.author?.name ?? "Unknown"
                                )}
                            </div>

                            <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                <Globe size={12} />
                                <span>•</span>
                                <span>{getRelativeTimeDifference(post.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-1">
                        <Ellipsis size={22} />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div>
                <div className="p-4 pt-3">
                    {/* Title */}
                    <div className="prose max-w-none text  mb-3 font-bold">
                        {post.job_title}
                    </div>

                    {/* Company, location, job type, salary */}
                    <div className="grid grid-cols-2 mb-3">
                        <div className="grid">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs w-15 text-gray-500">Company:</span>
                                <span className="w-[9ch] md:w-[100%] truncate">{post.company}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-xs w-15 text-gray-500">Location:</span>
                                <span>{post.location}</span>
                            </div>
                        </div>  
                        <div className="grid">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs w-11 text-gray-500">Type:</span>
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs">{post.job_type}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-xs w-12 text-gray-500">Salary:</span>
                                <span>{post.salary}</span>
                            </div>
                        </div>

                    </div>

                    {/* Job description */}
                    <div className="bg-muted p-2 italic text-sm rounded mb-3">
                        {post.job_description}
                    </div>

                    {/* Attachments */}
                    {post.attachments && post.attachments.length > 0 && (
                        <div className="grid grid-cols-1 gap-3">
                            {post.attachments.map((att) =>
                                att.type === "image" ? (
                                    <img
                                        key={att.attachment_id}
                                        src={att.url}
                                        alt="attachment"
                                        className="w-full h-[45vh] rounded-md object-cover"
                                    />
                                ) : (
                                    <div key={att.attachment_id} className="flex items-center gap-2 p-3 border rounded-md">
                                        <LinkIcon className="size-5" />
                                        <a href={att.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 truncate">
                                            {att.url}
                                        </a>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Footer: counts and timestamps */}
                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Heart className="size-4 text-rose-500" />
                                <span>{reactionCount}</span>
                            </div>
                        </div>

                        <div className="text-xs text-gray-400">
                            <div>{`Updated ${new Date(post.updated_at).toLocaleString()}`}</div>
                        </div>
                    </div>

                    {/* Actions */}
                    {hasActions && (
                        <div className="flex gap-2">
                            <PostActionReaction
                                post_id={post.post_id}
                                likedByUser={likedByUser}
                                setLikedByUser={setLikedByUser}
                                setReactionCount={setReactionCount}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
