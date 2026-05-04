import { Head, Link, usePage } from '@inertiajs/react'
import { Archive, Bell, Briefcase, BriefcaseBusiness, Building2, CalendarDays, Globe, GraduationCap, Image, Key, MapPin, Sparkles, UserCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import PostCreateModal from '@/components/post-create-modal'
import PostItem from '@/components/post-item'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UserAvatar from '@/components/user-avatar'
import AppLayout from '@/layouts/app-layout'
import { Alumni, CompleteAnnouncement, CompletePost, User } from '@/types'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import { Swiper, SwiperSlide } from 'swiper/react';
import { cn } from '../../lib/utils';
import AnnouncementModal from '@/components/announcement-modal';
import NewsFeedLayout from '@/layouts/news-feed-layout';
import { Card, CardContent } from '@/components/ui/card';



const NewsFeed = () => {
    const { props } = usePage<{
        posts: CompletePost[]
        auth: { user: User }
    }>();

    const [post, setPosts] = useState<CompletePost[]>(props.posts ?? []);

    const [createPostModal, setCreatePostModal] = useState(false)
    return (
        <NewsFeedLayout>
            {createPostModal && <PostCreateModal setCreatePostModal={setCreatePostModal} />}

            <div className="grid gap-2 lg:gap-4">
                <div className="overflow-hidden border border-slate-200 bg-white shadow-sm md:rounded-xl">
                    <div className="p-4 pb-2">
                        <div className="mb-2 flex items-center gap-2">
                            <UserAvatar avatar={props.auth.user.avatar ?? undefined} name={props.auth.user.name} />
                            <Input
                                onClick={() => setCreatePostModal(true)}
                                readOnly
                                endIcon={<BriefcaseBusiness size={20} />}
                                placeholder="Share a job opportunity with the alumni network..."
                                className="rounded-full border-0 bg-muted"
                            />
                        </div>
                    </div>
                </div>


                {
                    post.length > 0 ?
                        post.map((p) => (
                            <div
                                className="overflow-hidden border border-slate-200 bg-white shadow-sm md:rounded-xl"
                                key={p.post_uuid}
                            >
                                <PostItem post={p} />
                            </div>
                        ))
                        :
                        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
                            <Briefcase size={40} className="text-slate-300" />
                            <p className="text-sm font-medium text-slate-500">Nothing on the news-feed yet</p>
                            <p className="text-xs text-slate-400">Come back later for updates</p>
                        </div>
                }
            </div>
        </NewsFeedLayout>
    )
}

export default NewsFeed
