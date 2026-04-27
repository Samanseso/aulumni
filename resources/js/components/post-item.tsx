import { Link } from "@inertiajs/react";
import { Briefcase, BriefcaseBusiness, Building2, CalendarDays, Ellipsis, Globe, Heart, Link as LinkIcon, MapPin, MessageCircle, PhilippinePeso, Pin } from "lucide-react";
import { useState } from "react";

import { getRelativeTimeDifference } from "@/helper";
import { CompletePost } from "@/types";

import PostActionReaction from "./post-action-reaction";
import PostActionComment from "./post-action-comment";
import PostActionSave from "./post-action-save";
import UserAvatar from "./user-avatar";
import comment from '../routes/comment/index';

interface PostItemProps {
    post: CompletePost;
    hasActions?: boolean;
}

export default function PostItem({ post, hasActions = true }: PostItemProps) {
    const [reactionCount, setReactionCount] = useState<number>(post.reactions_count);
    const [commentCount, setCommentCount] = useState<number>(post.comments_count);
    const [likedByUser, setLikedByUser] = useState<boolean>(!!post.liked_by_user);
    const authorProfileUrl = post.author?.user_name ? `/${post.author.user_name}` : undefined;

    return (
        <div className="flex flex-col bg-white rounded-md">
            <div className="p-3 pb-0">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {authorProfileUrl ? (
                            <Link href={authorProfileUrl} className="z-10 rounded-full border">
                                <UserAvatar avatar={post.author?.avatar} name={post.author?.name ?? "Unknown"} />
                            </Link>
                        ) : (
                            <div className="z-10 rounded-full border">
                                <img
                                    className="h-10 w-10 rounded-full border-3 border-white"
                                    src="/assets/images/default-profile.png"
                                    alt="Profile"
                                />
                            </div>
                        )}

                        <div>
                            <div className="font-semibold hover:underline">
                                {authorProfileUrl ? (
                                    <Link href={authorProfileUrl}>{post.author.name}</Link>
                                ) : (
                                    post.author?.name ?? "Unknown"
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Globe size={12} />
                                <span>&bull;</span>
                                <span>{getRelativeTimeDifference(post.created_at)}</span>
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
                    <div className="prose mt-2 mb-4 max-w-none font-bold">
                        {post.job_title}
                    </div>

                    <div className="mb-3 grid grid-cols-2 gap-3">

                        <div className="rounded-lg bg-slate-100 p-3">
                            <div className="flex items-start gap-2">
                                <Building2 className="mt-0.5 size-4 text-blue" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Company</p>
                                    <p className="mt-1 text-sm text-slate-700">{post.company}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-3">
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 size-4 text-blue" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Location</p>
                                    <p className="mt-1 text-sm text-slate-700">{post.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-slate-100 p-3">
                            <div className="flex items-start gap-2">
                                <BriefcaseBusiness className="mt-0.5 size-4 text-blue" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Type</p>
                                    <p className="mt-1 text-sm text-slate-700">{post.job_type}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-3">
                            <div className="flex items-start gap-2">
                                <PhilippinePeso className="mt-0.5 size-4 text-blue" />
                                <div>
                                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Salary</p>
                                    <p className="mt-1 text-sm text-slate-700">{post.salary}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3 rounded-lg bg-muted p-3 text-sm italic">
                        {post.job_description}
                    </div>

                    {post.attachments && post.attachments.length > 0 && (
                        <div className="grid grid-cols-1 gap-3">
                            {post.attachments.map((att) =>
                                att.type === "image" ? (
                                    <img
                                        key={att.attachment_id}
                                        src={att.url}
                                        alt="attachment"
                                        className="h-[45vh] w-full rounded-md object-cover"
                                    />
                                ) : (
                                    <div key={att.attachment_id} className="flex items-center gap-2 rounded-md border p-3">
                                        <LinkIcon className="size-5" />
                                        <a href={att.url} target="_blank" rel="noreferrer" className="truncate text-sm text-blue-600">
                                            {att.url}
                                        </a>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                <div className="px-4 pb-4">
                    <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Heart className="size-4 text-rose-500" />
                                <span>{reactionCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageCircle className="size-4" />
                                <span>{commentCount}</span>
                            </div>
                        </div>

                        <div className="text-xs text-gray-400">
                            <div>{`Updated ${new Date(post.updated_at).toLocaleString()}`}</div>
                        </div>
                    </div>

                    {hasActions && (
                        <div className="flex gap-2">
                            <PostActionReaction
                                post_id={post.post_id}
                                likedByUser={likedByUser}   
                                setLikedByUser={setLikedByUser}
                                setReactionCount={setReactionCount}
                            />

                            <PostActionComment post_id={post.post_id} />

                            <PostActionSave post_id={post.post_id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
